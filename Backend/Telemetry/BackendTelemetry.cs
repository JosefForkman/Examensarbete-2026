using System.Collections.Concurrent;
using System.Data.Common;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using Microsoft.EntityFrameworkCore.Diagnostics;
namespace Backend.Telemetry;

public static class BackendTelemetry
{
    public const string ActivitySourceName = "Backend.EFCore";
    public const string MeterName = "Backend.EFCore";
    public static readonly ActivitySource ActivitySource = new(ActivitySourceName);
    public static readonly Meter Meter = new(MeterName);
    public static readonly Histogram<double> CommandDuration = Meter.CreateHistogram<double>(
        "backend_efcore_command_duration_ms",
        unit: "ms",
        description: "Duration of EF Core database commands.");
    public static readonly Counter<long> CommandCount = Meter.CreateCounter<long>(
        "backend_efcore_command_count",
        description: "Total EF Core database commands executed.");
    public static readonly Counter<long> CommandFailureCount = Meter.CreateCounter<long>(
        "backend_efcore_command_failure_count",
        description: "Total failed EF Core database commands.");
}
public sealed class EfCoreTelemetryInterceptor : DbCommandInterceptor
{
    private readonly ConcurrentDictionary<Guid, TelemetryState> _activeCommands = new();
    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result)
    {
        StartTelemetry(command, eventData, "reader");
        return result;
    }
    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        StartTelemetry(command, eventData, "reader");
        return new(result);
    }
    public override DbDataReader ReaderExecuted(DbCommand command, CommandExecutedEventData eventData, DbDataReader result)
    {
        StopTelemetry(eventData.CommandId, success: true);
        return result;
    }
    public override ValueTask<DbDataReader> ReaderExecutedAsync(
        DbCommand command,
        CommandExecutedEventData eventData,
        DbDataReader result,
        CancellationToken cancellationToken = default)
    {
        StopTelemetry(eventData.CommandId, success: true);
        return new(result);
    }
    public override InterceptionResult<int> NonQueryExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<int> result)
    {
        StartTelemetry(command, eventData, "nonquery");
        return result;
    }
    public override ValueTask<InterceptionResult<int>> NonQueryExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        StartTelemetry(command, eventData, "nonquery");
        return new(result);
    }
    public override int NonQueryExecuted(DbCommand command, CommandExecutedEventData eventData, int result)
    {
        StopTelemetry(eventData.CommandId, success: true);
        return result;
    }
    public override ValueTask<int> NonQueryExecutedAsync(
        DbCommand command,
        CommandExecutedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        StopTelemetry(eventData.CommandId, success: true);
        return new(result);
    }
#pragma warning disable CS8765, CS8609
    public override InterceptionResult<object> ScalarExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<object> result)
    {
        StartTelemetry(command, eventData, "scalar");
        return result;
    }
    public override ValueTask<InterceptionResult<object>> ScalarExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<object> result,
        CancellationToken cancellationToken = default)
    {
        StartTelemetry(command, eventData, "scalar");
        return new(result);
    }
    public override object ScalarExecuted(DbCommand command, CommandExecutedEventData eventData, object result)
    {
        StopTelemetry(eventData.CommandId, success: true);
        return result;
    }
    public override ValueTask<object> ScalarExecutedAsync(
        DbCommand command,
        CommandExecutedEventData eventData,
        object result,
        CancellationToken cancellationToken = default)
    {
        StopTelemetry(eventData.CommandId, success: true);
        return new(result);
    }
#pragma warning restore CS8765, CS8609

    public override void CommandFailed(DbCommand command, CommandErrorEventData eventData)
    {
        StopTelemetry(eventData.CommandId, success: false, eventData.Exception);
    }
    public override Task CommandFailedAsync(
        DbCommand command,
        CommandErrorEventData eventData,
        CancellationToken cancellationToken = default)
    {
        StopTelemetry(eventData.CommandId, success: false, eventData.Exception);
        return Task.CompletedTask;
    }
    private void StartTelemetry(DbCommand command, CommandEventData eventData, string commandKind)
    {
        var activity = BackendTelemetry.ActivitySource.StartActivity($"EF Core {commandKind}", ActivityKind.Client);
        if (activity is not null)
        {
            activity.SetTag("db.system", "postgresql");
            activity.SetTag("db.name", command.Connection?.Database);
            activity.SetTag("db.operation", ExtractOperation(command.CommandText));
            activity.SetTag("db.statement", NormalizeSql(command.CommandText));
            activity.SetTag("ef.command.kind", commandKind);
            activity.SetTag("ef.command.type", command.CommandType.ToString());
        }
        _activeCommands[eventData.CommandId] = new TelemetryState(commandKind, Stopwatch.StartNew(), activity);
        BackendTelemetry.CommandCount.Add(1, CreateTags(commandKind, success: true));
    }
    private void StopTelemetry(Guid commandId, bool success, System.Exception? exception = null)
    {
        if (!_activeCommands.TryRemove(commandId, out var state))
        {
            return;
        }
        state.Stopwatch.Stop();
        var tags = CreateTags(state.CommandKind, success);
        BackendTelemetry.CommandDuration.Record(state.Stopwatch.Elapsed.TotalMilliseconds, tags);
        if (!success)
        {
            BackendTelemetry.CommandFailureCount.Add(1, tags);
        }

        if (state.Activity is null)
        {
            return;
        }
        
        if (success)
        {
            state.Activity.SetStatus(ActivityStatusCode.Ok);
        }
        else
        {
            state.Activity.SetStatus(ActivityStatusCode.Error, exception?.Message ?? "EF Core command failed");
            state.Activity.SetTag("error.type", exception?.GetType().FullName);
            state.Activity.SetTag("error.message", exception?.Message);
        }
        state.Activity.Stop();
    }
    private static TagList CreateTags(string commandKind, bool success)
    {
        var tags = new TagList
        {
            { "db.system", "postgresql" },
            { "ef.command.kind", commandKind },
            { "success", success }
        };
        return tags;
    }
    private static string ExtractOperation(string commandText)
    {
        var normalized = NormalizeSql(commandText);
        if (string.IsNullOrWhiteSpace(normalized))
        {
            return "unknown";
        }
        var spaceIndex = normalized.IndexOf(' ');
        var operation = spaceIndex > 0 ? normalized[..spaceIndex] : normalized;
        return operation.ToUpperInvariant();
    }
    private static string NormalizeSql(string commandText)
    {
        if (string.IsNullOrWhiteSpace(commandText))
        {
            return string.Empty;
        }
        var normalized = commandText.ReplaceLineEndings(" ").Trim();
        return normalized.Length <= 512 ? normalized : normalized[..512];
    }
    private sealed record TelemetryState(string CommandKind, Stopwatch Stopwatch, Activity? Activity);
}

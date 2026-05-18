namespace Backend.Exception;

public class NotFoundException(string entityName, int entityId) : System.Exception
{
    private string EntityName { get; } = entityName;
    private int EntityId { get; } = entityId;
    public override string Message => $"{EntityName} with ID {EntityId} was not found.";
}
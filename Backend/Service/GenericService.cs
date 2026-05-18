using Backend.Data;
using Backend.Exception;
using Backend.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ValidationException = Backend.Exception.ValidationException;

namespace Backend.Service;

public class GenericService<T>(RSSDbContext context, IValidator<T> validator) : IGenericService<T> where T : class
{
    protected readonly DbSet<T> _dbSet = context.Set<T>();
    protected readonly IValidator<T> Validator = validator;

    public virtual async Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default)
    {
        var exceptions = new List<System.Exception>();
        var validationResult =
            await Validator.ValidateAsync(entity, options => options.IncludeRuleSets("Create"), cancellationToken);

        if (!validationResult.IsValid)
        {
            exceptions.AddRange(validationResult.Errors.Select(validationFailure =>
                new ValidationException(validationFailure.ErrorMessage)));
        }

        if (exceptions.Count > 0)
        {
            throw new AggregateException(exceptions);
        }

        await _dbSet.AddAsync(entity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        var exceptions = new List<System.Exception>();
        var validationResult =
            await Validator.ValidateAsync(entity, options => options.IncludeRuleSets("Update"), cancellationToken);

        if (!validationResult.IsValid)
        {
            exceptions.AddRange(validationResult.Errors.Select(e => new ValidationException(e.ErrorMessage)));
        }

        if (exceptions.Count > 0)
        {
            throw new AggregateException(exceptions);
        }

        _dbSet.Update(entity);
        await context.SaveChangesAsync(cancellationToken);
        return entity;
    }

    public virtual async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await GetByIdAsync(id);
        if (entity is null)
        {
            throw new NotFoundException(typeof(T).Name, id);
        }

        var dependencies = await CheckDependenciesAsync(entity, cancellationToken);
        if (dependencies.Count > 0)
        {
            throw new InvalidOperationException(
                $"Cannot delete {typeof(T).Name} with ID {id}. It has dependencies: {string.Join(", ", dependencies)}");
        }

        _dbSet.Remove(entity);
        await context.SaveChangesAsync(cancellationToken);
    }

    [Error<NotFoundException>]
    public virtual async Task<T> GetByIdAsync(int id)
    {
        var entry = await _dbSet.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
        if (entry is null)
        {
            throw new NotFoundException(typeof(T).Name, id);
        }

        return entry;
    }

    public virtual IQueryable<T> GetAll()
    {
        return _dbSet.AsNoTracking();
    }

    protected virtual async Task<List<string>> CheckDependenciesAsync(T entity, CancellationToken cancellationToken)
    {
        var dependencies = new List<string>();

        switch (entity)
        {
            case Website website:
            {
                var isPostItemExist = await context.Set<PostItem>()
                    .AnyAsync(postItem => postItem.WebsiteId == website.Id, cancellationToken);
                var isFollowedExist = await context.Set<Followed>()
                    .AnyAsync(followed => followed.WebsiteId == website.Id, cancellationToken);

                if (isPostItemExist)
                    dependencies.Add("PostItems");
                if (isFollowedExist)
                    dependencies.Add("Followed records");
                break;
            }
            case PostItem postItem:
            {
                var isWatchedExist = await context.Set<Watched>()
                    .AnyAsync(watched => watched.PostItemId == postItem.Id, cancellationToken);
                if (isWatchedExist)
                    dependencies.Add("Watched records");
                break;
            }
        }

        return dependencies;
    }
}
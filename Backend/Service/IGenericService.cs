using Backend.Exception;

namespace Backend.Service;

public interface IGenericService<T> where T : class
{
    /// <summary>
    /// Gets all entities as a searchable Queryable.
    /// Enables deferred execution for optimization in e.g. GraphQL.
    /// </summary>
    /// <returns>An <see cref="IQueryable{T}"/> for the entity type.</returns>
    IQueryable<T> GetAll();

    /// <summary>
    /// Gets a specific entity based on its unique identifier.
    /// </summary>
    /// <param name="id">The entity ID.</param>
    /// <returns>The entity if found, otherwise null.</returns>
    Task<T> GetByIdAsync(int id);

    /// <summary>
    /// Creates and saves a new entity in the database.
    /// </summary>
    /// <param name="entity">The entity to create.</param>
    /// <param name="cancellationToken">Allows the create operation to be canceled.</param>
    /// <returns>The created entity with an updated ID.</returns>
    [Error<ValidationException>]
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing entity in the database.
    /// </summary>
    /// <param name="entity">The entity with updated values.</param>
    /// <param name="cancellationToken">Allows the update operation to be canceled.</param>
    /// <returns>The updated entity.</returns>
    [Error<ValidationException>]
    [Error<NotFoundException>]
    Task<T> UpdateAsync(T entity, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes an entity from the database based on its ID.
    /// </summary>
    /// <param name="id">The ID of the entity to delete.</param>
    /// <param name="cancellationToken">Allows the delete operation to be canceled.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    [Error<NotFoundException>]
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}
using System;

namespace Backend.Service;

public interface IGenericService<T> where T : class
{
    Task<IQueryable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

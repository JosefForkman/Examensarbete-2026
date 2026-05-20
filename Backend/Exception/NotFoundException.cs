namespace Backend.Exception;

public class NotFoundException : System.Exception
{
    public NotFoundException(string entityName, int entityId)
        : base($"{entityName} with ID {entityId} was not found.")
    {
    }

    public NotFoundException(string entityName, string entityId)
        : base($"{entityName} with ID {entityId} was not found.")
    {
    }
}
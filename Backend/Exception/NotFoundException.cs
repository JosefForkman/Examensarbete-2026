namespace Backend.Exception;

public class NotFoundException(string entityName, int entityId) : System.Exception
{
    public override string Message => $"{entityName} with ID {entityId} was not found.";
}
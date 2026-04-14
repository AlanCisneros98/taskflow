namespace TasksService.DTOs;

public record CreateTaskDto(
    string Title,
    string Description,
    int UserId
);

public record UpdateTaskDto(
    string? Title,
    string? Description,
    bool? IsCompleted
);
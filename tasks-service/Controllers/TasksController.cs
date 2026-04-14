using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TasksService.Data;
using TasksService.DTOs;
using TasksService.Models;

namespace TasksService.Controllers;

[ApiController]
[Route("tasks")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<TasksController> _logger;

    public TasksController(AppDbContext db, ILogger<TasksController> logger)
    {
        _db = db;
        _logger = logger;
    }

    // GET /tasks?userId=1
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? userId)
    {
        var query = _db.Tasks.AsQueryable();

        if (userId.HasValue)
            query = query.Where(t => t.UserId == userId.Value);

        var tasks = await query
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(tasks);
    }

    // GET /tasks/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound(new { error = "Tarea no encontrada" });
        return Ok(task);
    }

    // POST /tasks
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { error = "El título es requerido" });

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            UserId = dto.UserId
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Tarea creada: {TaskId} por usuario {UserId}", task.Id, task.UserId);

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    // PUT /tasks/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound(new { error = "Tarea no encontrada" });

        if (dto.Title is not null) task.Title = dto.Title;
        if (dto.Description is not null) task.Description = dto.Description;
        if (dto.IsCompleted.HasValue)
        {
            task.IsCompleted = dto.IsCompleted.Value;
            task.CompletedAt = dto.IsCompleted.Value ? DateTime.UtcNow : null;
        }

        await _db.SaveChangesAsync();
        return Ok(task);
    }

    // DELETE /tasks/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task is null) return NotFound(new { error = "Tarea no encontrada" });

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
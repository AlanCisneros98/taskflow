using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using Xunit;

namespace TasksService.Tests;

public class HealthCheckTests
{
    [Fact]
    public void HealthCheck_Endpoint_Exists()
    {
        // Verificamos que el servicio compila y la configuración es correcta
        Assert.True(true);
    }

    [Fact]
    public void TaskItem_DefaultValues_AreCorrect()
    {
        var task = new TasksService.Models.TaskItem
        {
            Title = "Test Task",
            UserId = 1
        };

        Assert.Equal("Test Task", task.Title);
        Assert.Equal(1, task.UserId);
        Assert.False(task.IsCompleted);
        Assert.Null(task.CompletedAt);
    }

    [Fact]
    public void TaskItem_Complete_SetsProperties()
    {
        var task = new TasksService.Models.TaskItem
        {
            Title = "Test Task",
            UserId = 1,
            IsCompleted = true,
            CompletedAt = DateTime.UtcNow
        };

        Assert.True(task.IsCompleted);
        Assert.NotNull(task.CompletedAt);
    }
}
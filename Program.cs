using mcd_care_web.Authorization;
using mcd_care_web.Entities.Context;
using mcd_care_web.Helpers;
using mcd_care_web.Services.Implementation;
using mcd_care_web.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Platform API",
        Version = "v1",
        Description = "Platform API for swagger code generation",
    });
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddDbContext<AppDataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        assembly => { assembly.MigrationsAssembly(typeof(AppDataContext).Assembly.FullName); });
});

// configure DI for application services
builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));
builder.Services.AddScoped<IJwtUtils, JwtUtils>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
{
    builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins("http://localhost:4200/", "https://localhost:4200/");
}));

var app = builder.Build();

await ApplyMigrations(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
}

app.UseCors();
app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "MCD Care Api");
});
// global error handler
app.UseMiddleware<ErrorHandlerMiddleware>();

// custom jwt auth middleware
app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.Run();

static async Task ApplyMigrations(WebApplication app)
{
    using var scope = app.Services.CreateScope();

    var services = scope.ServiceProvider;
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var cancellationTokenSource = new CancellationTokenSource();

    try
    {
        logger.LogInformation("AutomaticMigration Enabled, attempting to migrate");

        var context = services.GetRequiredService<AppDataContext>();

        if (context.Database.IsSqlServer())
        {
            if (!context.Database.CanConnect())
            {
                logger.LogInformation("No database exists");
                return;
            }

            if (!await context.Database.CanConnectAsync(cancellationTokenSource.Token))
            {
                logger.LogInformation("Unable to connect to the specified database, it will be created");
            }

            var pendingMigrations = await context.Database
                .GetPendingMigrationsAsync(cancellationTokenSource.Token);

            var pendingMigrationCount = pendingMigrations.Count();
            if (pendingMigrationCount == 0)
            {
                logger.LogInformation("No pending migrations found. Database is up to date");
                return;
            }

            var pending = pendingMigrations
                .Aggregate((first, next) => first + ", " + next);
            logger.LogInformation("Pending Migrations: {Migrations}", pending);
            logger.LogInformation("Applying {Count} Migrations", pendingMigrationCount);
            await context.Database.MigrateAsync(cancellationTokenSource.Token);
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while migrating or seeding the database");
    }
}

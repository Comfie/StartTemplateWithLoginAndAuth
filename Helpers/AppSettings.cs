namespace mcd_care_web.Helpers;

public class AppSettings
{
    public string Secret { get; set; } = string.Empty;
    // refresh token time to live (in days), inactive tokens are
    // automatically deleted from the database after this time
    public int RefreshTokenTTL { get; set; }
    public string EmailFrom { get; set; } = string.Empty;
    public string SmtpHost { get; set; } = string.Empty;
    public int SmtpPort { get; set; } = int.MaxValue;
    public string SmtpUser { get; set; } = string.Empty;
    public string SmtpPass { get; set; } = string.Empty;

    public string[]? CorsOrigins { get; set; }
    public string WebUrl { get; set; } = string.Empty;
    public int RefreshTimeoutMinutes { get; set; }
    public int SessionTimeoutMinutes { get; set; }
}

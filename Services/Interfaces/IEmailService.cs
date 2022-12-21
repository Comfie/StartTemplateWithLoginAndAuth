namespace mcd_care_web.Services.Interfaces;

public interface IEmailService
{
    Task Send(string to, string subject, string html, string from = null);
}

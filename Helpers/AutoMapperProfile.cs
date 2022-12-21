using AutoMapper;
using mcd_care_web.Entities;
using mcd_care_web.Models;
using mcd_care_web.Models.Accounts;

namespace mcd_care_web.Helpers;

public class AutoMapperProfile :Profile
{
    public AutoMapperProfile()
    {
        CreateMap<User, CreateRequest>().ReverseMap();
        CreateMap<User, AccountResponse>().ReverseMap();
        CreateMap<User, AuthenticateResponse>().ReverseMap();
        CreateMap<RegisterRequest, User>().ReverseMap();
        CreateMap<UpdateRequest, User>()
            .ForAllMembers(x => x.Condition(
                (src, dest, prop) =>
                {
                    // ignore null & empty string properties
                    if (prop == null) return false;
                    if (prop.GetType() == typeof(string) && string.IsNullOrEmpty((string)prop)) return false;

                    // ignore null role
                    if (x.DestinationMember.Name == "Role" && src.Role == null) return false;

                    return true;
                }
            ));
    }
}

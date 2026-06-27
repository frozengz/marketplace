#pragma once
#include <httplib.h>
#include "../services/JwtService.hpp"
bool require_auth(const httplib::Request& request, httplib::Response& response, const JwtService& jwt_service);

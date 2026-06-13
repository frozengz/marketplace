#include "AuthMiddleware.hpp"
#include "../utils/Json.hpp"
bool require_auth(const httplib::Request& request, httplib::Response& response, const JwtService& jwt_service) { auto header = request.get_header_value("Authorization"); if (header.rfind("Bearer ", 0) != 0 || !jwt_service.verify(header.substr(7))) { write_json(response, 401, error_body("UNAUTHORIZED", "Authentication is required")); return false; } return true; }

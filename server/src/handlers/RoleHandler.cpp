#include "RoleHandler.hpp"
#include "../utils/Json.hpp"
RoleHandler::RoleHandler(Database& database, JwtService& jwt_service) : database_(database), jwt_service_(jwt_service) {}
void RoleHandler::register_routes(httplib::Server& server) { server.Get("/api/role/health", [](const httplib::Request&, httplib::Response& response) { write_json(response, 200, {{"data", "ok"}}); }); }

#include "AuthHandler.hpp"
#include "../utils/Json.hpp"
AuthHandler::AuthHandler(Database& database, JwtService& jwt_service) : database_(database), jwt_service_(jwt_service) {}
void AuthHandler::register_routes(httplib::Server& server) { server.Get("/api/auth/health", [](const httplib::Request&, httplib::Response& response) { write_json(response, 200, {{"data", "ok"}}); }); }

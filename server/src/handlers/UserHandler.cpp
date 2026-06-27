#include "UserHandler.hpp"
#include "../utils/Json.hpp"
UserHandler::UserHandler(Database& database, JwtService& jwt_service) : database_(database), jwt_service_(jwt_service) {}
void UserHandler::register_routes(httplib::Server& server) { server.Get("/api/user/health", [](const httplib::Request&, httplib::Response& response) { write_json(response, 200, {{"data", "ok"}}); }); }

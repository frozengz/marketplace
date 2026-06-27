#include "ListingHandler.hpp"
#include "../utils/Json.hpp"
ListingHandler::ListingHandler(Database& database, JwtService& jwt_service) : database_(database), jwt_service_(jwt_service) {}
void ListingHandler::register_routes(httplib::Server& server) { server.Get("/api/listing/health", [](const httplib::Request&, httplib::Response& response) { write_json(response, 200, {{"data", "ok"}}); }); }

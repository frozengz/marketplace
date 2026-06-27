#include <httplib.h>
#include "src/config/Config.hpp"
#include "src/db/Database.hpp"
#include "src/handlers/AuthHandler.hpp"
#include "src/handlers/UserHandler.hpp"
#include "src/handlers/ListingHandler.hpp"
#include "src/handlers/RoleHandler.hpp"
#include "src/services/JwtService.hpp"
int main() { Config config = load_from_env(); Database database(config.mongo_uri, config.mongo_database); JwtService jwt_service(config.jwt_secret); httplib::Server server; AuthHandler auth_handler(database, jwt_service); UserHandler user_handler(database, jwt_service); ListingHandler listing_handler(database, jwt_service); RoleHandler role_handler(database, jwt_service); auth_handler.register_routes(server); user_handler.register_routes(server); listing_handler.register_routes(server); role_handler.register_routes(server); server.listen("0.0.0.0", config.server_port); return 0; }

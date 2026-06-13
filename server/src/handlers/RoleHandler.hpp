#pragma once
#include <httplib.h>
#include "../db/Database.hpp"
#include "../services/JwtService.hpp"
class RoleHandler { public: RoleHandler(Database& database, JwtService& jwt_service); void register_routes(httplib::Server& server); private: Database& database_; JwtService& jwt_service_; };

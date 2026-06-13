#pragma once
#include <mongocxx/client.hpp>
#include <mongocxx/database.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <string>
class Database { public: Database(const std::string& uri, const std::string& database_name); mongocxx::database database(); void ensure_indexes(); private: inline static mongocxx::instance instance_{}; mongocxx::client client_; mongocxx::database database_; };

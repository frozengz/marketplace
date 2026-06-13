#pragma once
#include <pqxx/pqxx>
#include <memory>
#include <string>
class Database { public: explicit Database(std::string connection_string); pqxx::result execute(const std::string& sql); pqxx::connection& connection(); private: std::unique_ptr<pqxx::connection> connection_; };

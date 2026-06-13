#include "Database.hpp"
Database::Database(std::string connection_string) : connection_(std::make_unique<pqxx::connection>(connection_string)) {}
pqxx::result Database::execute(const std::string& sql) { pqxx::work transaction(*connection_); pqxx::result result = transaction.exec(sql); transaction.commit(); return result; }
pqxx::connection& Database::connection() { return *connection_; }

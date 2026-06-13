#pragma once
#include <cstdlib>
#include <string>
struct Config { std::string mongo_uri; std::string mongo_database; std::string jwt_secret; std::string smtp_host; int smtp_port; std::string smtp_user; std::string smtp_password; std::string base_url; int server_port; };
inline std::string env_string(const char* name, const std::string& fallback) { const char* value = std::getenv(name); return value == nullptr ? fallback : std::string(value); }
inline int env_int(const char* name, int fallback) { const char* value = std::getenv(name); return value == nullptr ? fallback : std::stoi(value); }
inline Config load_from_env() { return Config{env_string("MONGO_URI", "mongodb://mongo:27017"), env_string("MONGO_DATABASE", "marketplace"), env_string("JWT_SECRET", ""), env_string("SMTP_HOST", ""), env_int("SMTP_PORT", 587), env_string("SMTP_USER", ""), env_string("SMTP_PASSWORD", ""), env_string("BASE_URL", "http://localhost:5173"), env_int("SERVER_PORT", 8080)}; }

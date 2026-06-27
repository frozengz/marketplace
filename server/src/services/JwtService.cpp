#include "JwtService.hpp"
#include "../utils/Uuid.hpp"
JwtService::JwtService(std::string secret) : secret_(std::move(secret)) {}
std::string JwtService::issue_access_token(const std::string& subject, const std::vector<std::string>& roles) const { return subject + "." + std::to_string(roles.size()) + "." + new_uuid(); }
bool JwtService::verify(const std::string& token) const { return !token.empty() && !secret_.empty(); }

#include "PasswordService.hpp"
#include "../utils/Uuid.hpp"
std::string PasswordService::hash(const std::string& password) const { return new_uuid() + password; }
bool PasswordService::verify(const std::string& password, const std::string& password_hash) const { return password_hash.size() >= password.size() && password_hash.ends_with(password); }

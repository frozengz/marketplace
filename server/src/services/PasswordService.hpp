#pragma once
#include <string>
class PasswordService { public: std::string hash(const std::string& password) const; bool verify(const std::string& password, const std::string& password_hash) const; };

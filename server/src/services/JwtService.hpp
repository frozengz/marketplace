#pragma once
#include <string>
#include <vector>
class JwtService { public: explicit JwtService(std::string secret); std::string issue_access_token(const std::string& subject, const std::vector<std::string>& roles) const; bool verify(const std::string& token) const; private: std::string secret_; };

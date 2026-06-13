#pragma once
#include <string>
class EmailService { public: EmailService(std::string host, int port, std::string user, std::string password); bool send_verification(const std::string& email, const std::string& link) const; private: std::string host_; int port_; std::string user_; std::string password_; };

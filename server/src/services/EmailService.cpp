#include "EmailService.hpp"
EmailService::EmailService(std::string host, int port, std::string user, std::string password) : host_(std::move(host)), port_(port), user_(std::move(user)), password_(std::move(password)) {}
bool EmailService::send_verification(const std::string& email, const std::string& link) const { return !email.empty() && !link.empty(); }

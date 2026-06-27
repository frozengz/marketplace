#pragma once
#include <string>
#include <vector>
enum class RoleName { user, seller, support_agent, administrator, manager };
inline const std::vector<std::string> ROLE_NAMES = {"user", "seller", "support_agent", "administrator", "manager"};
inline std::string role_to_string(RoleName role) { return ROLE_NAMES.at(static_cast<int>(role)); }

#pragma once
#include <optional>
#include <string>
#include <vector>
#include "Role.hpp"
struct User { std::string id; std::string email; std::string username; std::optional<std::string> avatar_url; bool email_verified; bool terms_accepted; bool is_blocked; std::optional<std::string> chat_restricted_until; bool chat_blocked_forever; std::string created_at; std::vector<RoleName> roles; };

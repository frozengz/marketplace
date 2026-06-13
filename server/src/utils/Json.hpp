#pragma once
#include <httplib.h>
#include <nlohmann/json.hpp>
inline void write_json(httplib::Response& response, int status, const nlohmann::json& body) { response.status = status; response.set_content(body.dump(), "application/json"); }
inline nlohmann::json error_body(const std::string& code, const std::string& message) { return nlohmann::json{{"error", {{"code", code}, {"message", message}}}}; }

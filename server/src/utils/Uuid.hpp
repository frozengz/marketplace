#pragma once
#include <random>
#include <sstream>
#include <string>
inline std::string new_uuid() { static std::random_device device; static std::mt19937_64 engine(device()); std::uniform_int_distribution<unsigned long long> distribution; std::stringstream stream; stream << std::hex << distribution(engine); return stream.str(); }

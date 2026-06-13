FROM ubuntu:24.04
RUN apt-get update && apt-get install -y cmake g++ libpqxx-dev libcurl4-openssl-dev nlohmann-json3-dev libcpp-httplib-dev libssl-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN cmake -S . -B build && cmake --build build
CMD ["./build/marketplace_server"]

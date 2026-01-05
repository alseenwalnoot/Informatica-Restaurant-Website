cmake_minimum_required(VERSION 3.10)
project(MenuBackend)

set(CMAKE_CXX_STANDARD 20)

add_executable(app main.cpp)

# Crow is header-only
target_include_directories(app PRIVATE crow)

# JSON header-only
target_include_directories(app PRIVATE json)

# Link SQLite
target_link_libraries(app sqlite3)

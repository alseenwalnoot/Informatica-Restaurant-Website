cmake_minimum_required(VERSION 3.15)
project(MenuBackend LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(app main.cpp)

target_include_directories(app PRIVATE
    ${CMAKE_SOURCE_DIR}/Crow-HTTP/include
    ${CMAKE_SOURCE_DIR}/json
)

find_package(SQLite3 REQUIRED)

target_link_libraries(app PRIVATE SQLite::SQLite3)

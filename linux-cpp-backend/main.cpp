#include "crow.h"
#include "crow/mustache.h"
#include "json.hpp"
#include <sqlite3.h>
#include <string>

using json = nlohmann::json;

struct Meal {
    int id;
    std::string category;
    std::string name;
    std::string description;
    double price;
    std::string image;
};

bool getMeal(sqlite3* db, int meal_id, Meal& meal) { //we have 100 meals starting at 1.
    const char* query =
        "SELECT id, category, name, description, price, image "
        "FROM meals WHERE id = ?";

    sqlite3_stmt* stmt;
    if (sqlite3_prepare_v2(db, query, -1, &stmt, nullptr) != SQLITE_OK)
        return false;

    sqlite3_bind_int(stmt, 1, meal_id);

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        meal.id = sqlite3_column_int(stmt, 0);
        meal.category = (const char*)sqlite3_column_text(stmt, 1);
        meal.name = (const char*)sqlite3_column_text(stmt, 2);
        meal.description = (const char*)sqlite3_column_text(stmt, 3);
        meal.price = sqlite3_column_double(stmt, 4);
        meal.image = (const char*)sqlite3_column_text(stmt, 5);

        sqlite3_finalize(stmt);
        return true;
    }

    sqlite3_finalize(stmt);
    return false;
}

int main() {
    sqlite3* db;
    sqlite3_open("../meals.db", &db);

    crow::SimpleApp app;

    CROW_ROUTE(app, "/api/getmeal/<int>")
    ([&](int meal_id) {
        Meal meal;
        if (!getMeal(db, meal_id, meal))
            return crow::response(404);

        json j = {
            {"id", meal.id},
            {"category", meal.category},
            {"name", meal.name},
            {"description", meal.description},
            {"price", meal.price},
            {"image", meal.image}
        };

        crow::response r(j.dump());
        r.add_header("Access-Control-Allow-Origin", "*");
        return r;
    });

    CROW_ROUTE(app, "/api/getmeals/<int>-<int>")
    ([&](int from_meal, int to_meal) {
        if (from_meal > to_meal)
            return crow::response(400);

        json meals = json::array();
        int count = 0;

        for (int i = from_meal; i <= to_meal; i++) {
            Meal meal;
            if (!getMeal(db, i, meal))
                continue;

            meals.push_back({
                {"id", meal.id},
                {"category", meal.category},
                {"name", meal.name},
                {"description", meal.description},
                {"price", meal.price},
                {"image", meal.image}
            });

            count++;
        }

        json response = {
            {"ret_count", count},
            {"meals", meals}
        };

        crow::response r(response.dump());
        r.add_header("Access-Control-Allow-Origin", "*");
        return r;
    });


    CROW_ROUTE(app, "/")
    ([] {
        return crow::mustache::load("dist/index.html").render();
    });



    CROW_ROUTE(app, "/assets/<path>")
    ([&](const crow::request&, crow::response& res, std::string path) {
        std::string full =
            "templates/dist/assets/" + path;
        res.set_static_file_info(full);
        res.end();
    });
    
    CROW_ROUTE(app, "/fonts/<path>")
    ([&](const crow::request&, crow::response& res, std::string path) {
        std::string full =
            "templates/dist/fonts/" + path;
        res.set_static_file_info(full);
        res.end();
    });

    CROW_ROUTE(app, "/<string>")
    ([&](const crow::request&, crow::response& res, std::string file) {
        res.set_static_file_info("templates/dist/" + file);
        res.end();
    });

    app.port(8000).multithreaded().run();

    sqlite3_close(db);
}

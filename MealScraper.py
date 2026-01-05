import os
import json
import requests

BASE_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="
LIST_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s="

OUTPUT_DIR = "react-frontend/src/assets/menu"
JSON_FILE = "react-frontend/src/assets/menu.json"

os.makedirs(OUTPUT_DIR, exist_ok=True)

if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        menu = json.load(f)
else:
    menu = []

def download_image(url, path):
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(path, "wb") as f:
            f.write(r.content)

def get_all_meals():
    response = requests.get(LIST_URL)
    data = response.json()
    return data["meals"]

meals = get_all_meals()

for meal in meals:
    meal_id = meal["idMeal"]

    # get full details
    details = requests.get(BASE_URL + meal_id).json()
    details = details["meals"][0]

    name = details["strMeal"]
    category = details["strCategory"]
    origin = details["strArea"]
    thumb = details["strMealThumb"]

    print(f"\n{name}\n{'-'*len(name)}\n{category[:250]}...\n")

    # construct paths
    img_med   = os.path.join(OUTPUT_DIR, f"{meal_id}-med.jpg")

    # download 3 image sizes
    download_image(thumb, img_med)                 # normal thumb

    # append to json
    menu.append({
        "id": meal_id,
        "name": name,
        "category": category,
        "origin": origin,
        "image": img_med,
    })

    # save json after each
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(menu, f, indent=2, ensure_ascii=False)

print("Done!")

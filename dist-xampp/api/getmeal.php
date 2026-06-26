<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) { http_response_code(400); exit; }

$db = new SQLite3('meals.db');  // adjust path as needed

$stmt = $db->prepare(
    "SELECT id, category, name, description, price, image FROM meals WHERE id = ?"
);
$stmt->bindValue(1, $id, SQLITE3_INTEGER);
$result = $stmt->execute();

$row = $result->fetchArray(SQLITE3_ASSOC);
if (!$row) { http_response_code(404); exit; }

echo json_encode($row);
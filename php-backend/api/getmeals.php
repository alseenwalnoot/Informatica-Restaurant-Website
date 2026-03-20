<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$from = isset($_GET['from']) ? (int)$_GET['from'] : 0;
$to   = isset($_GET['to'])   ? (int)$_GET['to']   : 0;
if ($from > $to || $from <= 0) { http_response_code(400); exit; }

$db = new SQLite3('meals.db');

$meals = [];
for ($i = $from; $i <= $to; $i++) {
    $stmt = $db->prepare(
        "SELECT id, category, name, description, price, image FROM meals WHERE id = ?"
    );
    $stmt->bindValue(1, $i, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $row = $result->fetchArray(SQLITE3_ASSOC);
    if ($row) $meals[] = $row;
}

echo json_encode(["ret_count" => count($meals), "meals" => $meals]);
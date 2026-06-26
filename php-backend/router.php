<?php
$uri = $_SERVER['REQUEST_URI'];

// Serve static files directly
if ($uri === '/' || $uri === '') {
    readfile(__DIR__ . '/index.html');
    exit;
}

// Strip query string for file check
$path = __DIR__ . strtok($uri, '?');
if (file_exists($path) && !is_dir($path)) {
    return false; // Let PHP built-in server handle it
}
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];
if (preg_match('#^/api/getmeal/(\d+)$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    require __DIR__ . '/api/getmeal.php';
} elseif (preg_match('#^/api/getmeals/(\d+)-(\d+)$#', $uri, $m)) {
    $_GET['from'] = $m[1];
    $_GET['to']   = $m[2];
    require __DIR__ . '/api/getmeals.php';
} elseif (preg_match('#^/api/order$#', $uri) && $method === 'POST') {
    require __DIR__ . '/api/createorder.php';
} elseif (preg_match('#^/api/order/(\d+)$#', $uri, $m) && $method === 'GET') {
    $_GET['id'] = $m[1];
    require __DIR__ . '/api/getorder.php';
} elseif (preg_match('#^/api/orders$#', $uri) && $method === 'GET') {
    require __DIR__ . '/api/getorders.php';
} elseif (preg_match('#^/api/order/(\d+)$#', $uri, $m) && $method === 'DELETE') {
    $_GET['id'] = $m[1];
    require __DIR__ . '/api/deleteorder.php';
} elseif (preg_match('#^/api/sendreceipt$#', $uri) && $method === 'POST') {
    require __DIR__ . '/api/sendreceipt.php';
} elseif (preg_match('#^/api/track/([^/]+)/(\d+)$#', $uri, $m) && $method === 'GET') {
    $_GET['postcode'] = $m[1];
    $_GET['id'] = $m[2];
    require __DIR__ . '/api/trackorder.php';
} else {
    http_response_code(404);
}
<?php
$uri = $_SERVER['REQUEST_URI'];

if (preg_match('#^/api/getmeal/(\d+)$#', $uri, $m)) {
    $_GET['id'] = $m[1];
    require __DIR__ . '/api/getmeal.php';
} elseif (preg_match('#^/api/getmeals/(\d+)-(\d+)$#', $uri, $m)) {
    $_GET['from'] = $m[1];
    $_GET['to']   = $m[2];
    require __DIR__ . '/api/getmeals.php';
} else {
    http_response_code(404);
}
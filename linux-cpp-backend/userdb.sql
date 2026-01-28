CREATE TABLE carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    cartItems TEXT NOT NULL,
    cartCreateDate TEXT NOT NULL,
    cartExpired TEXT NOT NULL
);

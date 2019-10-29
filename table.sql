DROP TABLE IF EXISTS shoes;

CREATE TABLE shoes(
    id SERIAL NOT NULL  PRIMARY KEY,
    color TEXT NOT NULL,
    brand TEXT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL
);

INSERT INTO shoes(color, brand, price, size, in_stock) VALUES('red','nike', 800, 10, 10),('red','adidas', 500, 9, 5),('red','puma', 200, 10, 1);

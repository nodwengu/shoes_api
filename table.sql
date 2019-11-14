DROP TABLE IF EXISTS shoes;

CREATE TABLE brands(
    id SERIAL NOT NULL PRIMARY KEY,
    brand_name TEXT NOT NULL
);

CREATE TABLE colors(
    id SERIAL NOT NULL PRIMARY KEY,
    color_name TEXT NOT NULL
);

CREATE TABLE shoes(
    shoe_id SERIAL NOT NULL PRIMARY KEY,
    color_id INT NOT NULL,
    brand_id INT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    foreign key (color_id) references colors(id),
    foreign key (brand_id) references brands(id)
);

CREATE TABLE basket(
    id SERIAL NOT NULL  PRIMARY KEY,
    brand_name TEXT NOT NULL,
    brand_id INT NOT NULL,
    color_id INT NOT NULL, 
    color_name TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    shoe_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    foreign key (shoe_id) references shoes(shoe_id)
);


INSERT INTO shoes(color_id, brand_id, price, size, in_stock, imgurl) VALUES(6, 3, 800, 10, 10, './images/redNike.jpeg'), (7, 4, 500, 10, 20, './images/blackAdidas.jpeg');

INSERT INTO basket(color, brand, price, size, in_stock, shoe_id) VALUES('red','nike', 800, 10, 10, 49);

INSERT INTO basket(brand_name, color_id,color_name, brand_id, price, size, in_stock, imgurl) VALUES("Nike","Red", 6, 3, 800, 10, 10, './images/redNike.jpeg'));


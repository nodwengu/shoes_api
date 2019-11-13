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
    color TEXT NOT NULL,
    brand TEXT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    shoe_id INT NOT NULL,
    foreign key (shoe_id) references shoes(shoe_id)
);


INSERT INTO shoe(color_id, brand_id, price, size, in_stock, imgurl) VALUES(1, 1, 800, 10, 10, './images/redNike.jpeg'), (2, 2, 500, 10, 20, './images/blackAdidas.jpeg');

INSERT INTO basket(color, brand, price, size, in_stock, shoe_id) VALUES('red','nike', 800, 10, 10, 49);

DROP TABLE IF EXISTS shoes;

CREATE TABLE brands(
    id SERIAL NOT NULL PRIMARY KEY,
    brand_name TEXT NOT NULL
);

CREATE TABLE colors(
    id SERIAL NOT NULL PRIMARY KEY,
    color_name TEXT NOT NULL
);

CREATE TABLE sizes(
    id SERIAL NOT NULL PRIMARY KEY,
    size TEXT NOT NULL
);

CREATE TABLE shoes(
    shoe_id SERIAL NOT NULL PRIMARY KEY,
    color_id INT NOT NULL,
    brand_id INT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size_id INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL,
    foreign key (color_id) references colors(id),
    foreign key (brand_id) references brands(id),
    foreign key (size_id) references sizes(id)
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


INSERT INTO colors(color_name) VALUES('Red'),('Black'),('White'),('Pink');

INSERT INTO brands(brand_name) VALUES('Nike'),('Adidas'),('Puma'),('Allstar');

INSERT INTO sizes(size) VALUES(9),(10),(5),(1);

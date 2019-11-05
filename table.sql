DROP TABLE IF EXISTS shoes;

CREATE TABLE shoes(
    shoe_id SERIAL NOT NULL  PRIMARY KEY,
    color TEXT NOT NULL,
    brand TEXT NOT NULL, 
    price NUMERIC(12,2) NOT NULL,
    size INT NOT NULL,
    in_stock INT NOT NULL,
    imgurl TEXT NOT NULL
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


INSERT INTO shoes(color, brand, price, size, in_stock, imgurl) VALUES('red','nike', 800, 10, 10, './images/redNike.jpeg'), ('black','adidas', 500, 10, 20, './images/blackAdidas.jpeg');

INSERT INTO basket(color, brand, price, size, in_stock, shoe_id) VALUES('red','nike', 800, 10, 10, 49);

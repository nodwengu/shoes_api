module.exports = function ShoeService(pool) {

  async function all() {
    let query = `SELECT * FROM shoes s 
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id`;
    let results = await pool.query(query);

    return results.rows;
  }

  async function allByBrand(brand) {
    let query = `SELECT s.shoe_id, s.color_id, c.color_name, s.brand_id, b.brand_name, s.price, s.size, s.in_stock, s.imgurl
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  WHERE b.brand_name = '${brand}'`;

    let results = await pool.query(query);

    return results.rows[0];
  }

  async function allByColor(color) {
    let query = `SELECT s.shoe_id, s.color_id, c.color_name, s.brand_id, b.brand_name, s.price, s.size, s.in_stock, s.imgurl
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  WHERE c.color_name = '${color}'`;

    let results = await pool.query(query);

    return results.rows[0];
  }

  async function allBySize(size) {
    let query = `SELECT s.shoe_id, s.color_id, c.color_name, s.brand_id, b.brand_name, s.price, s.size, s.in_stock, s.imgurl
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  WHERE s.size = '${size}'`;

    let results = await pool.query(query);

    return results.rows[0];
  }

  async function allByBrandSize(brand, size) {
    let query = `SELECT s.shoe_id, s.color_id, c.color_name, s.brand_id, b.brand_name, s.price, s.size, s.in_stock, s.imgurl 
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  WHERE b.brand_name = '${brand}' AND s.size = ${size}`;

    let results = await pool.query(query);

    return results.rows[0];
  }

  async function allByBrandSizeColor(brand, size, color) {
    let query = `SELECT s.shoe_id, s.color_id, c.color_name, s.brand_id, b.brand_name, s.price, s.size, s.in_stock, s.imgurl 
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  WHERE b.brand_name = '${brand}' AND s.size = ${size} AND c.color_name = '${color}'`;
    
    let results = await pool.query(query);

    return results.rows[0];
  }

  

  async function create(shoe) {
    let data = [ 
      shoe.color.charAt(0).toUpperCase() + (shoe.color).slice(1), 
      shoe.brand.charAt(0).toUpperCase() + (shoe.brand).slice(1), 
      shoe.price, 
      shoe.size, 
      shoe.in_stock, 
      shoe.imgurl 
    ];

    let query = `INSERT INTO shoes(color,brand,price,size,in_stock,imgurl) VALUES($1, $2, $3, $4, $5, $6)`;

    let results = pool.query(query, data);
    return results;
  }

  //Update shoe if it already exists
  async function update(shoe){
    let data = [
      shoe.shoe_id,
      shoe.price,
      shoe.in_stock,
      shoe.imgurl ];
  
    let query = `UPDATE shoes SET shoe_id = $1, price = $2, in_stock = $3, imgurl = $4 
        WHERE shoe_id = $1`;
    return pool.query(query, data);
  }

  //Update the stock levels when a shoe is sold
  async function updateStock(id) {
    return pool.query(`UPDATE shoes SET in_stock = in_stock - 1 WHERE shoe_id = $1`, [id]);
  }

  async function increaseStock(id) {
    return pool.query(`UPDATE shoes SET in_stock = in_stock + 1 WHERE shoe_id = $1`, [id]);
  }

  async function deleteById(id) {
    return pool.query('DELETE FROM shoes WHERE id = $1', [id]);
  }

  async function createCart(shoe) {

    let data = [
      shoe.shoe_id,
      shoe.color_id,
      shoe.brand_id,
      shoe.price,
      shoe.size,
      shoe.in_stock,
      shoe.imgurl,
     
    ];
  
    let results = await pool.query(`INSERT INTO basket(shoe_id,color,brand,price,size,in_stock,imgurl) 
          VALUES($1, $2, $3, $4, $5, $6, $7)
          returning id`, data);
    return results.rows[0];
  }

  async function allFromBasket() {
    let query = `SELECT * FROM basket`;
    let results = await pool.query(query);

    return await results.rows;
  }

  async function deleteFromBasket() {
    return pool.query('DELETE FROM basket');
  }

  async function getOneBasket(brand, size, color) {
    let query = `SELECT * FROM basket WHERE brand = $1 AND size = $2 AND color = $3`;
    let results = await pool.query(query, [brand, size, color]);

    return results.rows[0];
  }

  async function updateBasketQuantity(id) {
    return pool.query(`UPDATE basket SET quantity = quantity + 1 WHERE shoe_id = $1`, [id]);
  }


  async function allColors() {
    let query = `SELECT DISTINCT color_name FROM colors
                ORDER BY color_name ASC`;
    let results = await pool.query(query);
    
    return results.rows;
  }

  async function allBrands() {
    let query = `SELECT DISTINCT brand_name FROM brands
                  ORDER BY brand_name ASC`;
    let results = await pool.query(query);
    
    return results.rows;
  }


  return {
    all,
    create,
    update,
    updateStock,
    increaseStock,
    deleteById,
    allByBrandSizeColor,
    allByBrandSize,
    allByBrand,
    allBySize,
    allByColor,
    createCart,
    allFromBasket,
    deleteFromBasket,
    getOneBasket,
    updateBasketQuantity,



    allColors,
    allBrands,

  };
};
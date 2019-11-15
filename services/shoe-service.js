module.exports = function ShoeService(pool) {

  async function all() {
    let query = `SELECT s.shoe_id, c.color_name, b.brand_name, s.price, size.size, s.in_stock, s.imgurl
                  FROM shoes s 
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  INNER JOIN sizes size ON s.size_id = size.id`;
    let results = await pool.query(query);

    return results.rows;
  }

  async function allByBrand(brand) {
    let query = `SELECT s.shoe_id, c.color_name, b.brand_name, s.price, size.size, s.in_stock, s.imgurl
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  INNER JOIN sizes size ON s.size_id = size.id
                  WHERE b.brand_name = '${brand}'`;

    let results = await pool.query(query);

    return results.rows;
  }

  async function allBySize(size) {
    let query = `SELECT s.shoe_id, c.color_name, b.brand_name, s.price, size.size, s.in_stock, s.imgurl
                  FROM shoes s
                  INNER JOIN brands b ON s.brand_id = b.id
                  INNER JOIN colors c ON s.color_id = c.id
                  INNER JOIN sizes size ON s.size_id = size.id
                  WHERE size.size = '${size}'`;

    let results = await pool.query(query);

    return results.rows;
  }

  async function allByBrandSize(brand, size) {
    let sql = `SELECT shoe.shoe_id, c.color_name, b.brand_name, shoe.price, s.size, shoe.in_stock, shoe.imgurl 
                  FROM shoes shoe
                  INNER JOIN brands b ON shoe.brand_id = b.id
                  INNER JOIN colors c ON shoe.color_id = c.id
                  INNER JOIN sizes s ON shoe.size_id = s.id 
                  WHERE b.brand_name = '${brand}' AND s.size = '${size}' `;

    let results = await pool.query(sql);

    return results.rows[0];
  }

  async function create(shoe) {
    let data = [ 
      shoe.color_id, 
      shoe.brand_id, 
      shoe.price, 
      shoe.size_id, 
      shoe.in_stock, 
      shoe.imgurl 
    ];

    let query = `INSERT INTO shoes(color_id, brand_id,price,size_id,in_stock,imgurl) VALUES($1, $2, $3, $4, $5, $6)`;

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
    let query = `UPDATE shoes 
                  SET in_stock = in_stock + (SELECT quantity FROM basket WHERE shoe_id = ${id}) 
                  WHERE shoe_id = ${id}`;
   
    let results = await pool.query(query);
    return results;
  }

  async function deleteById(id) {
    return pool.query('DELETE FROM shoes WHERE id = $1', [id]);
  }

  async function createCart(shoe) {
    let data = [
      shoe.brand_name,
      shoe.color_name,
      shoe.imgurl,
      shoe.in_stock,
      shoe.price,
      shoe.shoe_id,
      shoe.size
    ];
  
    let results = await pool.query(`INSERT INTO basket(brand_name,color_name, imgurl, in_stock, price, shoe_id, size) 
          VALUES($1, $2, $3, $4, $5, $6, $7)`, data);
    return results;
  }

  async function allFromBasket() {
    let query = `SELECT * FROM basket`;
    let results = await pool.query(query);

    return await results.rows;
  }

  async function deleteFromBasket(id) {
    return await pool.query('DELETE FROM basket WHERE shoe_id = $1', [id]);
  }

  async function getOneBasket(brand, size) {
    let query = `SELECT * FROM basket WHERE brand_name = $1 AND size = $2`;
    let results = await pool.query(query, [brand, size]);

    return results.rows[0];
  }

  async function updateBasketQuantity(id) {
    return pool.query(`UPDATE basket SET quantity = quantity + 1 WHERE shoe_id = $1`, [id]);
  }


  async function allColors() {
    let query = `SELECT DISTINCT color_name, id FROM colors
                ORDER BY color_name ASC`;
    let results = await pool.query(query);
    
    return results.rows;
  }

  async function allBrands() {
    let query = `SELECT DISTINCT brand_name, id FROM brands
                  ORDER BY brand_name ASC`;
    let results = await pool.query(query);
    
    return results.rows;
  }

  async function allSizes() {
    let query = `SELECT DISTINCT size, id FROM sizes
                  ORDER BY size ASC`;
    let results = await pool.query(query);
    
    return results.rows;
  }

  async function colorByName(name) {
    let query = `SELECT * FROM colors WHERE color_name = '${name}'`;
    let results = await pool.query(query);
    
    return results.rows[0];
  }

  async function brandByName(name) {
    let query = `SELECT * FROM brands WHERE brand_name = '${name}'`;
    let results = await pool.query(query);
    
    return results.rows[0];
  }

  async function sizeByName(size) {
    let query = `SELECT * FROM sizes WHERE size = '${size}'`;
    let results = await pool.query(query);
    
    return results.rows[0];
  }


  return {
    all,
    create,
    update,
    updateStock,
    increaseStock,
    deleteById,
    
    allByBrandSize,
    allByBrand,
    allBySize,
    createCart,
    allFromBasket,
    deleteFromBasket,
    getOneBasket,
    updateBasketQuantity,



    allColors,
    allBrands,
    allSizes,

    colorByName,
    brandByName,
    sizeByName

  };
};
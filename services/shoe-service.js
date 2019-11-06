module.exports = function ShoeService(pool) {

  async function all() {
    let query = `SELECT * FROM shoes`;
    let results = await pool.query(query);

    return await results.rows;
  }

  async function allByBrand(brandName) {
    let query = `SELECT * FROM shoes WHERE brand = $1`;
    let results = await pool.query(query, [brandName]);

    return results.rows;
  }

  async function allBySize(theSize) {
    let query = `SELECT * FROM shoes WHERE size = $1`;
    let results = await pool.query(query, [theSize]);

    return results.rows;
  }

  async function allByBrandSize(theBrand, theSize) {
    let query = `SELECT * FROM shoes WHERE brand = $1 AND size = $2`;
    let results = await pool.query(query, [theBrand, theSize]);

    return results.rows;
  }

  async function allByBrandSizeColor(theBrand, theSize, theColor) {
    let query = `SELECT * FROM shoes WHERE brand = $1 AND size = $2 AND color = $3`;
    let results = await pool.query(query, [theBrand, theSize, theColor]);

    return results.rows;
  }

  async function create(shoe) {
    let data = [ shoe.color, shoe.brand, shoe.price, shoe.size, shoe.in_stock ];

    let query = `INSERT INTO shoes(color,brand,price,size,in_stock) VALUES($1, $2, $3, $4, $5)`;

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
      shoe.color,
      shoe.brand,
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

  return {
    all,
    allByBrand,
    allBySize,
    allByBrandSize,
    create,
    // getOneById
    updateStock,
    increaseStock,
    deleteById,


    allByBrandSizeColor,




    createCart,
    allFromBasket,
    deleteFromBasket
  };
};
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
  async function updateStock(shoe) {
    let data = [
      shoe.color,
      shoe.brand,
      shoe.price,
      shoe.size,
      shoe.in_stock--,
      shoe.id
    ];

    let updateQuery = `UPDATE shoes 
          SET color = $1, 
              brand = $2, 
              price = $3,
              size = $4,
              in_stock = $5 
          WHERE id = $6`;

    return pool.query(updateQuery, data);
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
    //let query = `INSERT INTO basket(id,color,brand,price,size,in_stock,imgurl) VALUES($1, $2, $3, $4, $5, $6, $7)`;
    
    let results = await pool.query(`INSERT INTO basket(shoe_id,color,brand,price,size,in_stock,imgurl) 
          VALUES($1, $2, $3, $4, $5, $6, $7)
          returning id`, data);
    return results.rows[0];


    //return await pool.query(query, data);
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
    deleteById,


    allByBrandSizeColor,




    createCart,
    allFromBasket,
    deleteFromBasket
  };
};
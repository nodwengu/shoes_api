const assert = require('assert');
const chai = require('chai');

const CreateShoe = require('../services/shoe-service');

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/shoes_tests';

const pool = new Pool({
  connectionString
});

describe('The Shoes Catalogue', function () {

  beforeEach(async function () {
    pool.query("DELETE FROM shoes;");
  });

  it('should be able to add new shoes to the storage', async () => {
    const createShoe = CreateShoe(pool);

    let data1 = { color_id: 1, brand_id: 1, size_id: 1, price: 500,  in_stock: 20, imgurl: './images/redNike.jpeg' };
    let data2 = { color_id: 2, brand_id: 2, size_id: 2, price: 500,  in_stock: 20, imgurl: './images/blackAdidas.jpeg' };

    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.all();
    assert.equal(2, results.length);
  });

  it('should be able to list all shoes in stock', async () => {
    const createShoe = CreateShoe(pool);
    let data1 = { color_id: 1, brand_id: 1, size_id: 1, price: 500,  in_stock: 20, imgurl: './images/redNike.jpeg' };
    let data2 = { color_id: 2, brand_id: 2, size_id: 2, price: 500,  in_stock: 20, imgurl: './images/blackAdidas.jpeg' };
 
    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.all();
    assert.equal(2, results.length);
  });

  it('should be able to return a shoe for a given brand and size', async () => {
    const createShoe = CreateShoe(pool);
    let data2 = { color_id: 2, brand_id: 2, size_id: 2, price: 500,  in_stock: 20, imgurl: './images/blackAdidas.jpeg' };
 
    await createShoe.create(data2);

    let results = await createShoe.allByBrandSize('Adidas', 10);

    chai.assert.typeOf(results, 'array');
  });

  // it('should be able to return a shoe for a given brand and size and color', async () => {
  //   const createShoe = CreateShoe(pool);
  //   let data2 = { color_id: 2, brand_id: 2, size_id: 2, price: 500,  in_stock: 20, imgurl: './images/blackAdidas.jpeg' };
 
  //   await createShoe.create(data2);

  //   let results = await createShoe.allByBrandSizeColor('Adidas', 10, 'Black');
  //   chai.assert.typeOf(results, 'object');
  // });

  it('should be able to return a shoes for a given brand', async () => {
    const createShoe = CreateShoe(pool);
    let data2 = { color_id: 2, brand_id: 2, size_id: 2, price: 500,  in_stock: 20, imgurl: './images/blackAdidas.jpeg' };
 
    await createShoe.create(data2);

    let results = await createShoe.allByBrand('Adidas');
    
    chai.assert.typeOf(results, 'array');
  });

  it('should be able to return a shoes for a given size', async () => {
    const createShoe = CreateShoe(pool);
    let data2 = { color_id: 2, brand_id: 2, size_id: 2, price: 500,  in_stock: 20, imgurl: './images/blackAdidas.jpeg' };
 
    await createShoe.create(data2);

    let results = await createShoe.allBySize(10);
    chai.assert.typeOf(results, 'array');
  });


  after(function () {
    pool.query("DELETE FROM shoes;");
    pool.end();
  });
});
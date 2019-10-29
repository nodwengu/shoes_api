const assert = require('assert');

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

    let data1 = { color: 'red', brand: 'adidas', price: 500, size: 10, in_stock: 20 };
    let data2 = { color: 'blue', brand: 'nike', price: 100, size: 8, in_stock: 10 };
 
    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.all();
    assert.equal(2, results.length);
  });

  it('should be able to list all shoes in stock', async () => {
    const createShoe = CreateShoe(pool);
    let data1 = { color: 'red', brand: 'adidas', price: 500, size: 10, in_stock: 20 };
    let data2 = { color: 'blue', brand: 'nike', price: 100, size: 8, in_stock: 10 };
 
    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.all();
    assert.equal(2, results.length);
  });

  it('should be able to list all shoes for a given size', async () => {
    const createShoe = CreateShoe(pool);
    let data1 = { color: 'red', brand: 'adidas', price: 500, size: 10, in_stock: 20 };
    let data2 = { color: 'blue', brand: 'nike', price: 100, size: 8, in_stock: 10 };
 
    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.allBySize(10);
    assert.equal(1, results.length);
  });

  it('should be able to list all shoes for a given brand', async () => {
    const createShoe = CreateShoe(pool);
    let data1 = { color: 'red', brand: 'adidas', price: 500, size: 10, in_stock: 20 };
    let data2 = { color: 'blue', brand: 'nike', price: 100, size: 8, in_stock: 10 };
 
    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.allByBrand('adidas');
    assert.equal(1, results.length);
  });

  it('should be able to list all shoes for a given brand and size', async () => {
    const createShoe = CreateShoe(pool);
    let data1 = { color: 'red', brand: 'adidas', price: 500, size: 10, in_stock: 20 };
    let data2 = { color: 'blue', brand: 'nike', price: 100, size: 8, in_stock: 10 };
 
    await createShoe.create(data1);
    await createShoe.create(data2);

    let results = await createShoe.allByBrandSize('nike', 8);
    
    assert.equal(1, results.length);
  });


  after(function () {
    pool.query("DELETE FROM shoes;");
    pool.end();
  });
});
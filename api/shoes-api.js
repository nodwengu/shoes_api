
module.exports = function (shoeService) {

  async function all(req, res, next) {
    try {
      let results = await shoeService.all();
      res.json({
        status: 'success',
        data: results
      });
    }
    catch (err) {
      next(err);
    }
  };

  async function allByBrand(req, res, next) {
    try {
      let brand = req.params.brandname;
      let results = await shoeService.allByBrand(brand);
      res.json({
        status: 'success',
        data: results
      });
    }
    catch (error) {
      next(error);
    }
  }

  async function allBySize(req, res, next) {
    try {
      let size = req.params.size;
      let results = await shoeService.allBySize(size);
      res.json({
        status: 'success',
        data: results
      });
    }
    catch (error) {
      next(error);
    }
  }

  async function allByBrandSize(req, res, next) {
    try {
      let brand = req.params.brandname;
      let size = req.params.size;

      let results = await shoeService.allByBrandSize(brand, size);

      res.json({
        status: 'success',
        data: results
      });
    }
    catch (error) {
      next(error);
    }

  }

  async function allByBrandSizeColor(req, res, next) {
    try {
      let brand = req.params.brandname;
      let size = req.params.size;
      let color = req.params.color;

      let results = await shoeService.allByBrandSizeColor(brand, size, color);

      res.json({
        status: 'success',
        data: results
      });
    }
    catch (error) {
      next(error);
    }

  }

  async function add(req, res, next) {
    try {
      await shoeService.create({
        color: req.body.color,
        brand: req.body.brand,
        price: req.body.price,
        size: req.body.size,
        in_stock: req.body.in_stock,
        imgurl: req.body.imgurl
      });
      res.json({
        status: "success",
      });
    }
    catch (err) {
      res.json({
        status: "error",
        error: err.stack
      });
    }
  };

  async function updateStock(req, res, next) {
    try {
      await shoeService.updateStock(req.params.id);
      res.json({
        status: "success"
      });
    }
    catch (err) {
      res.json({
        status: "error",
        error: err.stack
      });
    }
  };

  async function addStock(req, res, next) {
    try {
      await shoeService.increaseStock(req.params.id);
      res.json({
        status: "success"
      });
      
    } catch (err) {
      res.json({
        status: "error",
        error: err.stack
      });
    }
  }

  async function deleteShoe(req, res, next) {
    try {
      let id = req.params.id;
      await shoeService.deleteById(id);
      res.json({
        status: "success"
      });
    }
    catch (err) {
      res.json({
        status: "error",
        error: err.stack
      });
    }
  };



  async function createCart(req, res, next) {
    try {
      await shoeService.createCart({
        shoe_id: req.body[0].shoe_id,
        color: req.body[0].color,
        brand: req.body[0].brand,
        price: req.body[0].price,
        size: req.body[0].size,
        in_stock: req.body[0].in_stock,
        imgurl: req.body[0].imgurl,
      });
      res.json({
        status: "success",
      });
    }
    catch (err) {
      res.json({
        status: "error",
        error: err.stack
      });
    }
  };

  async function allFromBasket(req, res, next) {
    try {
      let results = await shoeService.allFromBasket();
      res.json({
        status: 'success',
        data: results
      });
    }
    catch (err) {
      next(err);
    }
  };

  async function deleteFromBasket(req, res, next) {
    try {
      await shoeService.deleteFromBasket();
      res.json({
        status: 'success',
      });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    all,
    allByBrand,
    allBySize,
    allByBrandSize,
    add,
    updateStock,
    addStock,
    deleteShoe,


    allByBrandSizeColor,
    createCart,
    allFromBasket,
    deleteFromBasket
  };
};

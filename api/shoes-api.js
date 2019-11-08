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
      await shoeService.create(req.body);
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

  async function update(req, res, next) {
    try {
      await shoeService.update(req.body);
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
  }

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
      await shoeService.createCart(req.body);
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

  async function getOneFromCart(req, res, next) {
    try {
      let brand = req.params.brandname;
      let size = req.params.size;
      let color = req.params.color;

      let results = await shoeService.getOneBasket(brand, size, color);

      res.json({
        status: 'success',
        data: results
      });
    }
    catch (error) {
      next(error);
    }

  }

  async function increaseQuantity(req, res, next) {
    try {
      await shoeService.updateBasketQuantity(req.params.id);
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

  return {
    all,
    add,
    update,
    updateStock,
    addStock,
    deleteShoe,
    allByBrandSizeColor,
    createCart,
    allFromBasket,
    deleteFromBasket,
    getOneFromCart,
    increaseQuantity
  };
};

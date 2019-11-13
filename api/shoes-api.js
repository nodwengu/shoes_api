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

  async function allByColor(req, res, next) {
    try {
      let color = req.params.color;
  
      let results = await shoeService.allByColor(color);
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

  async function getAllBrands(req, res, next) {
    try {
      let results = await shoeService.allBrands();
      res.json({
        status: "success",
        data: results
      });
      
    } catch (err) {
      next(err);
    }
  }

  async function getAllColors(req, res, next) {
    try {
      let results = await shoeService.allColors();
      res.json({
        status: "success",
        data: results
      });
      
    } catch (err) {
      next(err);
    }
  }

  return {
    all,
    add,
    update,
    updateStock,
    addStock,
    deleteShoe,
    allByBrand,
    allBySize,
    allByColor,
    allByBrandSize,
    allByBrandSizeColor,
    createCart,
    allFromBasket,
    deleteFromBasket,
    getOneFromCart,
    increaseQuantity,

    getAllBrands,
    getAllColors
  };
};

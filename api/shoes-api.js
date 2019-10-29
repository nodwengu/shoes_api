
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

  async function add(req, res, next) {
    try {
      await shoeService.create({
        color: req.body.color,
        brand: req.body.brand,
        price: req.body.price,
        size: req.body.size,
        in_stock: req.body.in_stock
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
  	try{
  		await shoeService.updateStock({
  			color: req.body.color,
        brand: req.body.brand,
        price: req.body.price,
        size: Number(req.body.size),
        in_stock: Number(req.body.in_stock),
  			id: req.params.id
  		});
  		res.json({
  			status: "success"
  		});
  	}
  	catch(err){
  		res.json({
  			status: "error",
  			error: err.stack
  		});
  	}
  };

  async function deleteShoe(req, res, next) {
  	try{
  		let id = req.params.id;
  		await shoeService.deleteById(id);
  		res.json({
  			status: "success"
  		});
  	}
  	catch(err){
  		res.json({
  			status: "error",
  			error: err.stack
  		});
  	}
  };

  return {
    all,
    allByBrand,
    allBySize,
    allByBrandSize,
    add,
    updateStock,
    deleteShoe
  };
};

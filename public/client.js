document.addEventListener('DOMContentLoaded', function () {
  function compileTemplate(selector) {
    let template = document.querySelector(selector);
    let templateInstance = Handlebars.compile(template.innerHTML);
    return templateInstance;
  };

  const searchBtn = document.querySelector('#searchBtn');
  const addToCartBtn = document.querySelector('#addToCart');
  const cancelBasketBtn = document.querySelector('#cancelCart');
  const checkoutBtn = document.querySelector('#checkoutBtn');
  const addNewBtn = document.querySelector('.addNewBtn');
  const cancelAddNewBtn = document.querySelector('#cancelAddNew');
  const addBtnElem = document.querySelector('#addBtn');

  const addColorTemplate = document.querySelector('.addColorTemplate');
  const addBrandTemplate = document.querySelector('.addBrandTemplate');
  
  const addSizeTemplate = document.querySelector('.addSizeTemplate');

  const colorsTemplate = document.querySelector('.colorsTemplate');
  const sizesTemplate = document.querySelector('.sizesTemplate');
  const brandsTemplate = document.querySelector('.brandsTemplate');
  const shoeTemplate = document.querySelector('.myTemplate');
  const basketTemplate = document.querySelector('.basketTemplate');

  const addColorTemplateInstance = Handlebars.compile(addColorTemplate.innerHTML);
  const addBrandTemplateInstance = Handlebars.compile(addBrandTemplate.innerHTML);

  const addSizeTemplateInstance = Handlebars.compile(addSizeTemplate.innerHTML);

  const colorsTemplateInstance = Handlebars.compile(colorsTemplate.innerHTML);
  const sizesTemplateInstance = Handlebars.compile(sizesTemplate.innerHTML);
  const brandsTemplateInstance = Handlebars.compile(brandsTemplate.innerHTML);
  const shoeTemplateInstance = Handlebars.compile(shoeTemplate.innerHTML);
  const basketTemplateInstance = Handlebars.compile(basketTemplate.innerHTML);
  let errorsTemplateInstance = compileTemplate('.errorsTemplate');

  const colorSelectElem = document.querySelector(".colorSelect");
  const sizeSelectElem = document.querySelector('.sizeSelect');
  const brandSelectElem = document.querySelector('.brandSelect');

  const addColorsOptionsElem = document.querySelector('.addColorOption');
  const addBrandsOptionsElem = document.querySelector('.addBrandOption');
  const addSizesOptionsElem = document.querySelector('.addSizeOption');

  const colorsOptionsElem = document.querySelector('.colorOptions');
  const sizesOptionsElem = document.querySelector('.sizeOptions');
  const brandsOptionsElem = document.querySelector('.brandOptions');
  let errorsElem = document.querySelector('.errors');

  const selectedShoeElem = document.querySelector('.shoeInfo');
  const cartItemsElem = document.querySelector('.cartItems');

  // Client side Factory function
  const shoeService = ShoeService();

  async function showDropdowns() {
    try {
      let sizeResults = await shoeService.getSizes();
      let sizesResponse = sizeResults.data;
      let sizes = sizesResponse.data;

      let colorsResult = await shoeService.getColors();
      let colorsResponse = colorsResult.data;
      let colors = colorsResponse.data;

      let brandsResult = await shoeService.getBrands();
      let brandsResponse = brandsResult.data;
      let brands = brandsResponse.data;
      
      let colorsHTML = colorsTemplateInstance({ colors });
      let brandsHTML = brandsTemplateInstance({ brands }); 
      let sizesHTML = sizesTemplateInstance({ sizes });

      let addColorsHTML = addColorTemplateInstance({ colors });
      let addBrandsHTML = addBrandTemplateInstance({ brands });
      let addSizesHTML = addSizeTemplateInstance({ sizes });

      addColorsOptionsElem.innerHTML = addColorsHTML;
      addBrandsOptionsElem.innerHTML = addBrandsHTML;
      addSizesOptionsElem.innerHTML = addSizesHTML;

      brandsOptionsElem.innerHTML = brandsHTML;
      sizesOptionsElem.innerHTML = sizesHTML;
      colorsOptionsElem.innerHTML = colorsHTML;

    } catch (error) {
      console.error(error);
    }
  }

  async function showBasket() {
    try {
      let total = 0;
      let response = await shoeService.getAllFromBasket();
      let result = response.data;
      let basketList = result.data;

      let basketHTML = basketTemplateInstance({
        basketList
      });

      cartItemsElem.innerHTML = basketHTML;

      basketList.forEach(item => {
        total += Number(item.price * item.quantity);
      });
      document.querySelector('.cartTotal').innerHTML = total.toFixed(2);

      document.querySelector('.fa-stack[data-count]').setAttribute("data-count", basketList.length);

    } catch (error) {
      console.error(error);
    }
  }

  async function searchShoe() {
    try {
      let selectedColorOption = colorSelectElem.options[colorSelectElem.selectedIndex].value;
      let selectedSizeOption = sizeSelectElem.options[sizeSelectElem.selectedIndex].value;
      let selectedBrandOption = brandSelectElem.options[brandSelectElem.selectedIndex].value;

      let errors = [];
      if (!selectedColorOption) {
        errors.push('Select a Color');
      }
      if (!selectedSizeOption) {
        errors.push('Select a Size');
      }
      if (!selectedBrandOption) {
        errors.push('Select a Brand');
      }
   
      if (errors.length === 0) {
        errorsElem.innerHTML = '';

        let response = await shoeService.getByBrandSize(selectedBrandOption, selectedSizeOption);
        let result = response.data;
        let selectedShoe = result.data;
    
        if(selectedShoe) {
          if(selectedShoe.in_stock == 0) {
            let shoeHTML = shoeTemplateInstance(selectedShoe);
            selectedShoeElem.innerHTML = shoeHTML;
            addToCartBtn.style.display = "none";
          } else {
            document.querySelector('.errorMsg').style.display = "none";
            let shoeHTML = shoeTemplateInstance(selectedShoe);
            selectedShoeElem.innerHTML = shoeHTML;
            addToCartBtn.style.display = "block";
          }          
        } else {
          document.querySelector('.errorMsg').style.display = "block";
          document.querySelector('.errorMsg').innerHTML = "Item: OUT OF STOCK";
          document.querySelector('.shoeInfo').innerHTML = "No Data Found...";
          document.querySelector('.shoeInfo').classList.add('animated', 'fadeIn', 'warning'); 
          addToCartBtn.style.display = "none";
        }      
      } else {
        errorsElem.innerHTML = errorsTemplateInstance({ errors });
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function addToCart() {
    try {
      let selectedColorOption = colorSelectElem.options[colorSelectElem.selectedIndex].value;
      let selectedSizeOption = sizeSelectElem.options[sizeSelectElem.selectedIndex].value;
      let selectedBrandOption = brandSelectElem.options[brandSelectElem.selectedIndex].value;
      
      let response = await shoeService.getByBrandSize(selectedBrandOption, selectedSizeOption);
      let result = response.data;
      let selectedShoe = result.data;
      
      if (selectedShoe.in_stock > 0) {
        let id = selectedShoe.shoe_id;
        // updates stock in shoes table
        await shoeService.updateStock(id);
        
        let cartResult = await shoeService.getOneFromCart(selectedBrandOption, selectedSizeOption);
        let cartResponse = cartResult.data;
        let shoe = cartResponse.data;
       
        if(shoe !== undefined) {
          // Increasing quantity in the basket for existing shoe item
          await shoeService.updateQuantity(shoe.shoe_id);
        } else {
          // Adding new shoe to the basket/cart
          await shoeService.addToBasket(selectedShoe);
        }

        let shoeHTML = shoeTemplateInstance(selectedShoe);
        selectedShoeElem.innerHTML = shoeHTML;

        showBasket();
      } else {
        document.querySelector('.errorMsg').style.display = "block";
        document.querySelector('.errorMsg').innerHTML = "Item: OUT OF STOCK";
        document.querySelector('.shoeInfo').classList.add('animated', 'fadeIn', 'warning'); 

        setTimeout(function () {
          // Reload the current page without the browser cache
          location.reload(true);
        }, 2000);
        
      }
      // let shoeHTML = shoeTemplateInstance(selectedShoe);
      // selectedShoeElem.innerHTML = shoeHTML;
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelBasket() {
    try {
      
      let basketResponse = await shoeService.getAllFromBasket();
      let basketResult = basketResponse.data;
      let basketData = basketResult.data;
    
      if(basketData.length > 0) {
        for(let i = 0; i < basketData.length; i++) {
          let elem = basketData[i];
          
          // check if you can find the element on the shoes list
          let response = await shoeService.getByBrandSize(elem.brand_name, elem.size);
          let result = response.data;
          let selectedShoe = result.data;
      
          if(selectedShoe.shoe_id === elem.shoe_id) {
            await shoeService.addStock(elem.shoe_id);
            await shoeService.clearBasket(elem.shoe_id);
          }
        }
      }
      // Reload the current page without the browser cache
      location.reload(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function checkoutBasket() {
    try {
      //remove all the items from the basket
      let basketResponse = await shoeService.getAllFromBasket();
      let basketResult = basketResponse.data;
      let basketData = basketResult.data;

      if(basketData.length > 0) {
        for(let i = 0; i < basketData.length; i++) {
          let elem = basketData[i];
          await shoeService.clearBasket(elem.shoe_id);
        }
      }
      // Reload the current page without the browser cache
      location.reload(true);

    } catch (error) {
      console.error(error);
    }
  }

  async function addShoe() {
    try {
      //Get user input values
      let selectedAddColorOption = addColorsOptionsElem.options[addColorsOptionsElem.selectedIndex].value;
      let selectedAddBrandOption = addBrandsOptionsElem.options[addBrandsOptionsElem.selectedIndex].value;
      let selectedAddSizeOption = addSizesOptionsElem.options[addSizesOptionsElem.selectedIndex].value;

      let colorVal = selectedAddColorOption.toLowerCase();
      let sizeVal = selectedAddSizeOption;
      let brandVal = selectedAddBrandOption.toLowerCase();
      let priceVal = Number(document.querySelector('#price').value);
      let inStockVal = Number(document.querySelector('#quantity').value);
      let imageVal = document.querySelector('#imageUrl').value;

      let validColor = colorVal !== 'undefined' && colorVal.trim() != '';
      let validSize = typeof sizeVal === 'string' && sizeVal.trim() != '';
      let validBrand = brandVal !== 'undefined' && brandVal.trim() != '';
      let validPrice = typeof priceVal === 'number' && priceVal != '';
      let validInstock = typeof inStockVal === 'number' && inStockVal != '';
      let validImageVal = typeof imageVal === 'string' && imageVal.trim() != '';

      let errors = [];

      if (!validColor) {
        errors.push('Invalid Color');
      }
      if (!validSize) {
        errors.push('Invalid Size');
      }
      if (!validBrand) {
        errors.push('Invalid Brand');
      }
      if (!validPrice) {
        errors.push('Invalid Price');
      }
      if (!validInstock) {
        errors.push('Invalid InStock');
      }
      if (!validImageVal) {
        errors.push('Invalid Image url');
      }

      brandVal = brandVal.charAt(0).toUpperCase() + brandVal.slice(1);
      colorVal = colorVal.charAt(0).toUpperCase() + colorVal.slice(1);

      if (errors.length === 0) {
        let response = await shoeService.getByBrandSize(brandVal, sizeVal);
        let result = response.data;
        let selectedShoe = result.data;
    
        if(selectedShoe) {
          // Need to update the selected shoe
          await shoeService.update({
            shoe_id: selectedShoe.shoe_id,
            price: priceVal,
            in_stock: inStockVal,
            imgurl: imageVal
          });

          document.querySelector('.successMessage').innerHTML = "Shoe was updated successfully.";
          document.querySelector('.successMessage').style.display = "block";
          setTimeout(function () {
            document.querySelector('.addNew-wrapper').style.display = "none";
            document.querySelector('.successMessage').style.display = "none";
          }, 2000);

          let input_fields = document.querySelectorAll('#form-input input');
          input_fields.forEach(input => {
            input.value = "";
          });

        } else {
          let brandResults = await shoeService.getBrandByName(brandVal);
          let brandResponse = brandResults.data;
          let brandId = brandResponse.data.id;

          let colorResults = await shoeService.getColorByName(colorVal);
          let colorResponse = colorResults.data;
          let colorId = colorResponse.data.id;

          let sizeResults = await shoeService.getSizeByName(sizeVal);
          let sizeResponse = sizeResults.data;
          let sizeId = sizeResponse.data.id;
          
          //add it to the shoes
          let input = {
            color_id: colorId,
            brand_id: brandId,
            size_id: sizeId,
            price: priceVal,
            in_stock: inStockVal,
            imgurl: imageVal
          };
          
          await shoeService.addShoe(input);

          let input_fields = document.querySelectorAll('#form-input input');
          input_fields.forEach(input => {
            input.value = "";
          });
          document.querySelector('.successMessage').innerHTML = "Shoe was added successfully.";
          document.querySelector('.successMessage').style.display = "block";
          setTimeout(function () {
            document.querySelector('.addNew-wrapper').style.display = "none";
            document.querySelector('.successMessage').style.display = "none";
          }, 2000);

        } 
      } else {
        errorsElem.innerHTML = errorsTemplateInstance({ errors });
      }
      showDropdowns();
    } catch (error) {
      console.error(error);
    }

  }

  showDropdowns();
  showBasket();

  searchBtn.addEventListener('click', searchShoe);
  addToCartBtn.addEventListener('click', addToCart);
  cancelBasketBtn.addEventListener('click', cancelBasket);
  checkoutBtn.addEventListener('click', checkoutBasket);
  addBtnElem.addEventListener('click', addShoe);

  addNewBtn.addEventListener('click', () => {
    document.querySelector('.addNew-wrapper').style.display = "block";
  });

  cancelAddNewBtn.addEventListener('click', () => {
    showDropdowns();
    document.querySelector('.addNew-wrapper').style.display = "none";
  });


});


function ShoeService() {
  function getAllShoes() {
    return axios.get('/api/shoes');
  }

  function getColors() {
    return axios.get('/api/colors');
  }

  function getBrands() {
    return axios.get('/api/brands');
  }

  function getSizes() {
    return axios.get('/api/sizes');
  }

  function getByBrand(brand) {
    return axios.get(`/api/shoes/brand/${brand}`);
  }

  function getByColor(color) {
    return axios.get(`/api/shoes/color/${color}`);
  }

  function getBySize(size) {
    return axios.get(`/api/shoes/size/${size}`);
  }

  function getByBrandSize(brand, size) {
    return axios.get(`/api/shoes/brand/${brand}/size/${size}`);
  }

  function updateStock(id) {
    return axios.post(`/api/shoes/sold/${id}`);
  }

  function addStock(id) {
    return axios.post(`/api/shoes/cancel/${id}`);
  }

  function addShoe(data) {
    return axios.post('/api/shoes', data);
  }

  function update(data) {
    return axios.post(`/api/shoes/update`, data);
  }

  function getAllFromBasket() {
    return axios.get('/api/cart');
  }

  function addToBasket(data) {
    return axios.post('/api/cart', data);
  }

  function clearBasket(id) {
    return axios.get(`/api/cart/delete/${id}`);
  }

  function getOneFromCart(brand, size) {
    return axios.get(`/api/basket/brand/${brand}/size/${size}`);
  }

  function updateQuantity(id) {
    return axios.post(`/api/basket/updateQuantity/${id}`);
  }

  function getBrandByName(name) {
    return axios.get(`/api/brands/${name}`);
  }

  function getColorByName(name) {
    return axios.get(`/api/colors/${name}`);
  }

  function getSizeByName(size) {
    return axios.get(`/api/sizes/${size}`);
  }




  return {
    getAllShoes,
    getByBrand,
    getBySize,
    getByColor,
    getByBrandSize,
    updateStock,
    addStock,
    addShoe,
    update,
    getAllFromBasket,
    addToBasket,
    clearBasket,
    getOneFromCart,
    updateQuantity,

    getColors,
    getBrands,
    getSizes,
    getBrandByName,
    getColorByName,
    getSizeByName
  };
}
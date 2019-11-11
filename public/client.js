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

  const colorsTemplate = document.querySelector('.colorsTemplate');
  const sizesTemplate = document.querySelector('.sizesTemplate');
  const brandsTemplate = document.querySelector('.brandsTemplate');
  const shoeTemplate = document.querySelector('.myTemplate');
  const basketTemplate = document.querySelector('.basketTemplate');

  const colorsTemplateInstance = Handlebars.compile(colorsTemplate.innerHTML);
  const sizesTemplateInstance = Handlebars.compile(sizesTemplate.innerHTML);
  const brandsTemplateInstance = Handlebars.compile(brandsTemplate.innerHTML);
  const shoeTemplateInstance = Handlebars.compile(shoeTemplate.innerHTML);
  const basketTemplateInstance = Handlebars.compile(basketTemplate.innerHTML);
  let errorsTemplateInstance = compileTemplate('.errorsTemplate');

  const colorSelectElem = document.querySelector("#colorSelect");
  const sizeSelectElem = document.querySelector('#sizeSelect');
  const brandSelectElem = document.querySelector('#brandSelect');

  const colorsOptionsElem = document.querySelector('.colorOptions');
  const sizesOptionsElem = document.querySelector('.sizeOptions');
  const brandsOptionsElem = document.querySelector('.brandOptions');
  let errorsElem = document.querySelector('.errors');

  const selectedShoeElem = document.querySelector('.shoeInfo');
  const cartItemsElem = document.querySelector('.cartItems');

  // Client side Factory function
  const shoeService = ShoeService();

  function getSorted(arr){
    return arr.sort(function(a, b){ return a - b; });
  }
  
  function getColors(arr) {
    let newArr = arr.map((item) => {
      return item.color.charAt(0).toUpperCase() + (item.color).slice(1);
    });
    //MAKING SURE COLOR IS NOT REPEATED ON THE DROPDOWN
    //return Array.from(new Set(newArr)).sort();

    let colors = Array.from(new Set(newArr)).sort();
    return getSorted(colors);
  }

  function getSizes(arr) {
    let newArr = arr.map((item) => {
      return item.size; 
    });
    //return Array.from(new Set(newArr)).sort();
    let sizes = Array.from(new Set(newArr)).sort();
    return getSorted(sizes);
  }

  function getBrands(arr) {
    let newArr = arr.map((item) => {
      return item.brand.charAt(0).toUpperCase() + (item.brand).slice(1);
    });
    //return Array.from(new Set(newArr)).sort();

    let brands = Array.from(new Set(newArr)).sort();
    return getSorted(brands);
  }

  async function showDropdowns() {
    try {
      const response = await shoeService.getAllShoes();
      let result = response.data;
      let data = result.data;
     
      let colorsHTML = colorsTemplateInstance({
        colors: getColors(data)
      });
      let sizesHTML = sizesTemplateInstance({
        sizes: getSizes(data)
      });
      let brandsHTML = brandsTemplateInstance({
        brands: getBrands(data)
      });

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

        let response = await shoeService.getByBrandSizeColor(selectedBrandOption, selectedSizeOption, selectedColorOption);
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

        let response = await shoeService.getByBrandSizeColor(selectedBrandOption, selectedSizeOption, selectedColorOption);
        let result = response.data;
        let selectedShoe = result.data;
     
        if (selectedShoe.in_stock > 0) {
          let id = selectedShoe.shoe_id;
          await shoeService.updateStock(id);

          let cartResult = await shoeService.getOneFromCart(selectedBrandOption, selectedSizeOption, selectedColorOption);
          let cartResponse = cartResult.data;
          let shoe = cartResponse.data;

          if(shoe) {
            // edit the quantity for the shoe in the basket
            await shoeService.updateQuantity(shoe.shoe_id);
          } else {
            await shoeService.addToBasket(selectedShoe);
          }

          let shoeHTML = shoeTemplateInstance(selectedShoe);
          selectedShoeElem.innerHTML = shoeHTML;

          showBasket();
        } else {
          addToCartBtn.style.display = "none";
        }
      } else {
        errorsElem.innerHTML = errorsTemplateInstance({ errors });
      }

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
          let elem = basketData[0];
          for(let j = 0; j < elem.quantity; j++) {
            await shoeService.addStock(elem.shoe_id);
          }
        }

        await shoeService.clearBasket();

        showBasket();

        // Reload the current page without the browser cache
        location.reload(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function checkoutBasket() {
    try {
      //remove all the items from the basket
      await shoeService.clearBasket();
      showBasket();
      location.reload(true);

    } catch (error) {
      console.error(error);
    }
  }

  async function addShoe() {
    try {
      //Get user input values
      let colorVal = (document.querySelector('#color').value).toLowerCase();
      let sizeVal = document.querySelector('#size').value;
      let brandVal = (document.querySelector('#brand').value).toLowerCase();
      let priceVal = Number(document.querySelector('#price').value);
      let inStockVal = Number(document.querySelector('#quantity').value);
      let imageVal = document.querySelector('#imageUrl').value;

      let validColor = typeof colorVal === 'string' && colorVal.trim() != '';
      let validSize = typeof sizeVal === 'string' && sizeVal.trim() != '';
      let validBrand = typeof brandVal === 'string' && brandVal.trim() != '';
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
        let response = await shoeService.getByBrandSizeColor(brandVal, sizeVal, colorVal);
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
          }, 3000);

        } else {
          //add it to the shoes
          await shoeService.addShoe({
            color: colorVal,
            size: sizeVal,
            brand: brandVal,
            price: priceVal,
            in_stock: inStockVal,
            imgurl: imageVal,
          });
          let input_fields = document.querySelectorAll('#form-input input');
          input_fields.forEach(input => {
            input.value = "";
          });
          document.querySelector('.successMessage').innerHTML = "Shoe was added successfully.";
          document.querySelector('.successMessage').style.display = "block";
          setTimeout(function () {
            document.querySelector('.addNew-wrapper').style.display = "none";
            document.querySelector('.successMessage').style.display = "none";
          }, 3000);

          // showDropdowns();
        }
        showDropdowns();
      
      } else {
        errorsElem.innerHTML = errorsTemplateInstance({ errors });
      }

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
    document.querySelector('.addNew-wrapper').style.display = "none";
  });


});


function ShoeService() {
  function getAllShoes() {
    return axios.get('/api/shoes');
  }

  function getByBrand(brand) {
    return axios.get(`/api/shoes/brand/${brand}`);
  }

  function getBySize(size) {
    return axios.get(`/api/shoes/size/${size}`);
  }

  function getByBrandSize(brand, size) {
    return axios.get(`/api/shoes/brand/${brand}/size/${size}`);
  }

  function getByBrandSizeColor(brand, size, color) {
    return axios.get(`/api/shoes/brand/${brand}/size/${size}/color/${color}`);
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

  function clearBasket() {
    return axios.get('/api/cart/delete');
  }

  function getOneFromCart(brand, size, color) {
    return axios.get(`/api/basket/brand/${brand}/size/${size}/color/${color}`);
  }

  // function addStock(id) {
  //   return axios.post(`/api/shoes/cancel/${id}`);
  // }

  function updateQuantity(id) {
    return axios.post(`/api/basket/updateQuantity/${id}`);
  }




  return {
    getAllShoes,
    getByBrand,
    getBySize,
    getByBrandSize,
    updateStock,
    addStock,
    addShoe,
    update,

    getByBrandSizeColor,

    getAllFromBasket,
    addToBasket,
    clearBasket,
    getOneFromCart,
    updateQuantity
  };
}
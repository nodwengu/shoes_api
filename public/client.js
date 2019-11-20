
document.addEventListener('DOMContentLoaded', function () {
  function compileTemplate(selector) {
    let template = document.querySelector(selector);
    let templateInstance = Handlebars.compile(template.innerHTML);
    return templateInstance;
  };

  //Reference template from the DOM by Template class names
  const colorsTemplate = document.querySelector('.colorsTemplate');
  const sizesTemplate = document.querySelector('.sizesTemplate');
  const brandsTemplate = document.querySelector('.brandsTemplate');
  const filteredShoesTemplate = document.querySelector('.filteredShoesTemplate');
  const basketTemplate = document.querySelector('.basketTemplate');
  const allShoesTemplate = document.querySelector('.allShoesTemplate');

  const addColorTemplate = document.querySelector('.addColorTemplate');
  const addBrandTemplate = document.querySelector('.addBrandTemplate');
  const addSizeTemplate = document.querySelector('.addSizeTemplate');

  //Creating and compiling template instances
  const colorsTemplateInstance = Handlebars.compile(colorsTemplate.innerHTML);
  const sizesTemplateInstance = Handlebars.compile(sizesTemplate.innerHTML);
  const brandsTemplateInstance = Handlebars.compile(brandsTemplate.innerHTML);
  const filteredShoesTemplateInstance = Handlebars.compile(filteredShoesTemplate.innerHTML);
  const basketTemplateInstance = Handlebars.compile(basketTemplate.innerHTML);
  const errorsTemplateInstance = compileTemplate('.errorsTemplate');
  const allShoesTemplateInstance = Handlebars.compile(allShoesTemplate.innerHTML);

  const addColorTemplateInstance = Handlebars.compile(addColorTemplate.innerHTML);
  const addBrandTemplateInstance = Handlebars.compile(addBrandTemplate.innerHTML);
  const addSizeTemplateInstance = Handlebars.compile(addSizeTemplate.innerHTML);

  const searchBtn = document.querySelector('#searchBtn');
  const cancelBasketBtn = document.querySelector('#cancelCart');
  const checkoutBtn = document.querySelector('#checkoutBtn');
  const addNewBtn = document.querySelector('.addNewBtn');
  const cancelAddNewBtn = document.querySelector('#cancelAddNew');
  const addBtnElem = document.querySelector('#addBtn');
  const allShoesBtn = document.querySelector('#allShoesBtn');

  const addToCartBtn = document.querySelector('#displayData');
  const addToCartBtn2 = document.querySelector('#showAll');

  let errorsElem = document.querySelector('.errors');

  const colorSelectElem = document.querySelector(".colorSelect");
  const sizeSelectElem = document.querySelector('.sizeSelect');
  const brandSelectElem = document.querySelector('.brandSelect');

  const addColorElem = document.querySelector('.addColorSelect');
  const addBrandElem = document.querySelector('.addBrandSelect');
  const addSizeElem = document.querySelector('.addSizeSelect');

  const showFilteredShoesElem = document.querySelector('.showFilteredShoes');
  const showCartItemsElem = document.querySelector('.showCartItems');
  const showAllShoesElem = document.querySelector('.showAllShoes');

  // Client side Factory function
  const shoeService = ShoeService();

  allShoesBtn.addEventListener('click', showAllShoes);

  async function showAllShoes() {
    showFilteredShoesElem.innerHTML = "";
    let response = await shoeService.getAllShoes();
    let results = response.data;
    let allShoes = results.data;
    
    let allShoesHTML = allShoesTemplateInstance({ allShoes });
    showAllShoesElem.innerHTML = allShoesHTML;
  }

  
  
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

      addColorElem.innerHTML = addColorsHTML;
      addBrandElem.innerHTML = addBrandsHTML;
      addSizeElem.innerHTML = addSizesHTML;

      brandSelectElem.innerHTML = brandsHTML;
      sizeSelectElem.innerHTML = sizesHTML;
      colorSelectElem.innerHTML = colorsHTML;

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

      showCartItemsElem.innerHTML = basketHTML;

      basketList.forEach(item => {
        total += Number(item.price * item.quantity);
      });
      document.querySelector('.cartTotal').innerHTML = total.toFixed(2);

      document.querySelector('.fa-stack[data-count]').setAttribute("data-count", basketList.length);

    } catch (error) {
      console.error(error);
    }
  }

  function outOfStockMessage() {
    document.querySelector('.errorMsg').style.display = "block";
    document.querySelector('.errorMsg').innerHTML = "Item: OUT OF STOCK";
    document.querySelector('.shoeInfo').innerHTML = "No Data Found...";
    document.querySelector('.shoeInfo').classList.add('animated', 'fadeIn', 'warning'); 
    setTimeout(function () {
      document.querySelector('.errorMsg').style.display = "none";
    }, 2000);
  }

  function showSuccessMessage() {
    let input_fields = document.querySelectorAll('#form-input input');
    input_fields.forEach(input => {
      input.value = "";
    });
    document.querySelector('.successMessage').style.display = "block";
    setTimeout(function () {
      document.querySelector('.addNew-wrapper').style.display = "none";
      document.querySelector('.successMessage').style.display = "none";
    }, 2000);
  }

  async function searchShoe() {
    try {
      let selectedColorOption = colorSelectElem.options[colorSelectElem.selectedIndex].value;
      let selectedSizeOption = sizeSelectElem.options[sizeSelectElem.selectedIndex].value;
      let selectedBrandOption = brandSelectElem.options[brandSelectElem.selectedIndex].value;

      let errors = [];
      let selectedShoes = [];
      showAllShoesElem.innerHTML = "";

      if(selectedColorOption == '' && selectedSizeOption == '' && selectedBrandOption !== '') {
        let response = await shoeService.getByBrand(selectedBrandOption);
        let result = response.data;
        selectedShoes = result.data;

        if(selectedShoes.length > 0) {
          let shoeHTML = filteredShoesTemplateInstance({ selectedShoes });
          showFilteredShoesElem.innerHTML = shoeHTML;
        } else {
          outOfStockMessage();
        }

      } else if(selectedColorOption == '' && selectedBrandOption == '' && selectedSizeOption !== '') {
        let response = await shoeService.getBySize(selectedSizeOption);
        let result = response.data;
        selectedShoes = result.data;

        if(selectedShoes.length > 0) {
          let shoeHTML = filteredShoesTemplateInstance({ selectedShoes });
          showFilteredShoesElem.innerHTML = shoeHTML;
        } else {
          outOfStockMessage();
        } 

      } else if (selectedColorOption == '' && selectedSizeOption !== '' && selectedBrandOption !== '') {
        let response = await shoeService.getByBrandSize(selectedBrandOption, selectedSizeOption);
        let result = response.data;
        selectedShoes = result.data;

        if(selectedShoes.length > 0) {
          let shoeHTML = filteredShoesTemplateInstance({ selectedShoes });
          showFilteredShoesElem.innerHTML = shoeHTML;
        } else {
          outOfStockMessage();
        }

      } else {
        alert("select at least one from dropdown");
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  

  async function addToCart(evt) {
    try {
      let cartResponse = await shoeService.getAllFromBasket();
      let cartResults = cartResponse.data;
      let basketData = cartResults.data;

      let response = await shoeService.getAllShoes();
      let results = response.data;
      let selectedShoes = results.data;

      let id = evt.target.id;

      let shoeFromCart = basketData.filter( item => {
        return item.shoe_id == id;
      });

      if(selectedShoes.length > 0) {
        for (item of selectedShoes) {
          if(item.shoe_id == id) {
            if(item.in_stock > 0) {
              await shoeService.updateStock(id);
              
              if(shoeFromCart[0] !== undefined) {
                // Increasing quantity in the basket for existing shoe item
                await shoeService.updateQuantity(item.shoe_id);
              } else {
                // Adding new shoe to the basket/cart
                await shoeService.addToBasket(item);
              }

              // let shoeHTML = filteredShoesTemplateInstance({ selectedShoes });
              // showFilteredShoesElem.innerHTML = shoeHTML;

            } else {
              outOfStockMessage();
            }
          }
        }
        showBasket();  
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelBasket() {
    try {
      let cartResponse = await shoeService.getAllFromBasket();
      let cartResults = cartResponse.data;
      let basketData = cartResults.data;

      let response = await shoeService.getAllShoes();
      let results = response.data;
      let selectedShoes = results.data;
    
      if(basketData.length > 0) {
        for(let i = 0; i < basketData.length; i++) {
          let elem = basketData[i];
        
          for (let shoe of selectedShoes) {
            if(shoe.shoe_id === elem.shoe_id) {
              await shoeService.addStock(elem.shoe_id);
              await shoeService.clearBasket(elem.shoe_id);
            }
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
      let selectedAddColorOption = addColorElem.options[addColorElem.selectedIndex].value;
      let selectedAddBrandOption = addBrandElem.options[addBrandElem.selectedIndex].value;
      let selectedAddSizeOption = addSizeElem.options[addSizeElem.selectedIndex].value;

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
        let brandResults = await shoeService.getBrands();
        let brandResponse = brandResults.data;
        let brands = brandResponse.data;

        let colorResults = await shoeService.getColors();
        let colorResponse = colorResults.data;
        let colors = colorResponse.data;

        let sizeResults = await shoeService.getSizes();
        let sizeResponse = sizeResults.data;
        let sizes = sizeResponse.data;
        
        let response = await shoeService.getAllShoes();
        let result = response.data;
        let selectedShoes = result.data;

        let shoeItem = selectedShoes.filter( item => {
          return item.color_name == colorVal && item.brand_name == brandVal && item.size == sizeVal;
        });

        if(shoeItem[0] !== undefined) {
          // Need to update the selected shoe
          await shoeService.update({
            shoe_id: shoeItem[0].shoe_id,
            price: priceVal,
            in_stock: inStockVal,
            imgurl: imageVal
          });
          document.querySelector('.successMessage').innerHTML = "Shoe was updated successfully.";
          showSuccessMessage();
      
        } else {
          let color = colors.filter( color => {
            return color.color_name == colorVal;
          });
          let size = sizes.filter( size => {
            return size.size == sizeVal;
          });
          let brand = brands.filter( brand => {
            return brand.brand_name == brandVal;
          });

          //add it to the shoes
          let input = {
            color_id: color[0].id,
            brand_id: brand[0].id,
            size_id: size[0].id,
            price: priceVal,
            in_stock: inStockVal,
            imgurl: imageVal
          };   
          await shoeService.addShoe(input);
          document.querySelector('.successMessage').innerHTML = "Shoe was added successfully.";
          showSuccessMessage();
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
  addToCartBtn2.addEventListener('click', addToCart);
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
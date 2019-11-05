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

  const colorsTemplate = document.querySelector('.colorsTemplate');
  const sizesTemplate = document.querySelector('.sizesTemplate');
  const brandsTemplate = document.querySelector('.brandsTemplate');
  const shoeTemplate = document.querySelector('.myTemplate');
  const basketTemplate = document.querySelector('.basketTemplate');

  const colorsTemplateInstance = Handlebars.compile(colorsTemplate.innerHTML);
  const sizesTemplateInstance = Handlebars.compile(sizesTemplate.innerHTML);
  const brandsTemplateInstance = Handlebars.compile(brandsTemplate.innerHTML);
  const shoeTemplateInstance = Handlebars.compile(shoeTemplate.innerHTML);
  const basketTemplateInstance =  Handlebars.compile(basketTemplate.innerHTML);
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

  async function showDropdowns() {
    try {
      const response = await shoeService.getAllShoes();
      let result = response.data;
      let data = result.data;
    
    
      let colorsHTML = colorsTemplateInstance({
        colors: data
      });
      let sizesHTML = sizesTemplateInstance({
        sizes: data
      });
      let brandsHTML = brandsTemplateInstance({
        brands: data
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
      const response = await shoeService.getAllFromBasket();
      let result = response.data;
      let basketList = result.data;
  
      let basketHTML = basketTemplateInstance({
        basketList
      });
     
      cartItemsElem.innerHTML = basketHTML;

      basketList.forEach(item => {
        total += Number(item.price);
      });
      document.querySelector('.cartTotal').innerHTML = total;

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
     
      if(errors.length === 0) {
        errorsElem.innerHTML = '';
      
        let response = await shoeService.getByBrandSizeColor(selectedBrandOption, selectedSizeOption, selectedColorOption);
        let result = response.data;
        let selectedShoe = result.data;

        let shoeHTML = shoeTemplateInstance({
          selectedShoe: selectedShoe
        });
        selectedShoeElem.innerHTML = shoeHTML;
      } else {
        errorsElem.innerHTML = errorsTemplateInstance({errors});
      }

    } catch (error) {
      console.error(error);
    }
  };

  async function addToCart() {
    //reduce stock for the currrently selected item by one
    //if item already exists in the basket increase the quantity for the item
    //
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

      if(errors.length === 0) {
        errorsElem.innerHTML = '';

        let response = await shoeService.getByBrandSizeColor(selectedBrandOption, selectedSizeOption, selectedColorOption);
        let result = response.data;
        let selectedShoe = result.data;
    
        await shoeService.addToBasket(selectedShoe);
        showBasket();
      } else {
        errorsElem.innerHTML = errorsTemplateInstance({errors});
      }
    }
    catch(error) {
      console.error(error);
    } 
  }

  async function cancelBasket() {
    await shoeService.clearBasket();
    //Should be able to update the front end
    showBasket();

    //add all the shoes from basket back to shoes table
    //reset basket counter to equal zero
  }

  async function checkoutBasket() {
    alert("about to checkout the items!");
    //remove all the items from the basket
    //reset everything to its default value
  }

  showDropdowns();
  showBasket();

  searchBtn.addEventListener('click', searchShoe);
  addToCartBtn.addEventListener('click', addToCart);
  cancelBasketBtn.addEventListener('click', cancelBasket);
  checkoutBtn.addEventListener('click', checkoutBasket);


});




function ShoeService() {
  let basketList = [];

  function createBasket(data) {
    basketList.push(data);
  }

  function getCart() {
    return basketList;
  }
  
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

  function addShoe(data) {
    return axios.post('/api/shoes', data);
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




  return {
    // addShoe,
    getAllShoes,
    getByBrand,
    getBySize,
    getByBrandSize,
    addShoe,

    getByBrandSizeColor,

    getAllFromBasket,
    addToBasket,


    getCart,
    createBasket,
    clearBasket
  };
}
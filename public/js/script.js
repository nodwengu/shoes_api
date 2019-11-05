
const addNewBtnElem = document.querySelector('.addNewBtn');
const addBtnElem = document.querySelector('#addBtn');
const cancelAddNewBtn = document.querySelector('#cancelAddNew');
const cancelCartBtn = document.querySelector('#cancelCart');
const searchBtn = document.querySelector('#searchBtn');
const addToCartBtn = document.querySelector('#addToCart');
const checkoutBtn = document.querySelector('#checkoutBtn');

let colorOptions = document.querySelectorAll('.colorOption');
let sizeOptions = document.querySelectorAll('.sizeOption');
let brandOptions = document.querySelectorAll('.brandOption');

let colorsOptionElem = document.querySelector('.colorOptions');
let sizesOptionElem = document.querySelector('.sizeOptions');
let brandsOptionElem = document.querySelector('.brandOptions');

const shoeCatalogueInstance = createShoeCatalogue(data, colors, sizes, brands);

function storeShoe() {
  let shoesList = shoeCatalogueInstance.getShoeList();

  //Get user input values
  let colorVal = (document.querySelector('#color').value).toLowerCase();
  let sizeVal = document.querySelector('#size').value;
  let brandVal = (document.querySelector('#brand').value).toLowerCase();
  let priceVal = Number(document.querySelector('#price').value);
  let inStockVal = Number(document.querySelector('#quantity').value);
  let imageVal = document.querySelector('#imageUrl').value;

  //Set user inputs
  shoeCatalogueInstance.setShoe(colorVal, sizeVal, brandVal, priceVal, inStockVal, imageVal);
  if (colorVal == "" || sizeVal == "" || brandVal == "" || priceVal == "" || inStockVal == "" || imageVal == "") {
    document.querySelector('.errorMessage').innerHTML = "Please provide required input data";
    document.querySelector('.errorMessage').style.display = "block";
    setTimeout(function () {
      document.querySelector('.errorMessage').style.display = "none";
    }, 3000);
    return;
  }

  //Check if a color,size,and brand already exists for a particular shoe
  if (!shoeCatalogueInstance.checkInput(shoesList)) {

    shoeCatalogueInstance.setShoeList();
    //Check if color, size, and brand is repeated
    shoeCatalogueInstance.setColorsAdded(shoesList)
    shoeCatalogueInstance.setSizesAdded(shoesList)
    shoeCatalogueInstance.setBrandsAdded(shoesList)

    if (colors) {
      let newColors = { colors }
      createColorsHTML(newColors)
    }
    if (sizes) {
      let newSizes = { sizes }
      createSizesHTML(newSizes)
    }
    if (brands) {
      let newBrands = { brands }
      createBrandsHTML(newBrands)
    }

    let input_fields = document.querySelectorAll('#form-input input');
    input_fields.forEach(input => {
      input.value = "";
    })
    document.querySelector('.successMessage').innerHTML = "Shoe was added successfully.";
    document.querySelector('.successMessage').style.display = "block";
    setTimeout(function () {
      document.querySelector('.successMessage').style.display = "none";
    }, 3000);

  } else {
    shoeCatalogueInstance.updateShoe(shoesList);
  }
}

let selectedColor = shoeCatalogueInstance.getSelectedColor();
let selectedSize = shoeCatalogueInstance.getSelectedSize();
let selectedBrand = shoeCatalogueInstance.getSelectedBrand();

if (colors) {
  let newColors = { colors }
  createColorsHTML(newColors)
}
if (sizes) {
  let newSizes = { sizes }
  createSizesHTML(newSizes)
}
if (brands) {
  let newBrands = { brands }
  createBrandsHTML(newBrands)
}

function searchShoes() {
  let colorOptions = document.querySelectorAll('.colorOption');
  let sizeOptions = document.querySelectorAll('.sizeOption');
  let brandOptions = document.querySelectorAll('.brandOption');

  let isColorOptionFound = findColor(colorOptions);
  let isSizeOptionFound = findSize(sizeOptions);
  let isBrandOptionFound = findBrand(brandOptions);

  let selectedColorOption;
  let selectedSizeOption;
  let selectedBrandOption;

  if (isColorOptionFound && isSizeOptionFound && isBrandOptionFound) {
    for (let i = 0; i < data.length; i++) {
      let currentItem = data[i];

      colorOptions.forEach((colorOption) => {
        if (colorOption.selected) {
          selectedColorOption = colorOption.value;
        }
      });
      sizeOptions.forEach((sizeOption) => {
        if (sizeOption.selected) {
          selectedSizeOption = sizeOption.value;
        }
      });
      brandOptions.forEach((brandOption) => {
        if (brandOption.selected) {
          selectedBrandOption = brandOption.value;
        }
      });

      if (currentItem.color == selectedColorOption && currentItem.size == selectedSizeOption && currentItem.brand == selectedBrandOption) {
        document.querySelector('.errorMsg').style.display = "none";
        createShoeHTML(currentItem)
        return
      } else {
        document.querySelector('.errorMsg').style.display = "block";
        document.querySelector('.errorMsg').innerHTML = "Item: OUT OF STOCK";
        document.querySelector('.shoeInfo').innerHTML = "No Data Found...";
        document.querySelector('.shoeInfo').classList.add('animated', 'fadeIn', 'warning');
      }
    };
  }
}

function findColor(colorOptions) {
  let isColorFound = false;

  colorOptions.forEach((colorItem) => {
    if (colorItem.selected) {
      data.forEach((currentShoe) => {
        for (let key in currentShoe) {
          if (Object.values(currentShoe).indexOf(colorItem.value) > -1) {
            isColorFound = true;
            selectedColor = currentShoe.color
          }
        }
      });
    }
  });
  return isColorFound;
}

function findSize(sizeOptions) {
  let isSizeFound = false;

  sizeOptions.forEach((sizeItem) => {
    if (sizeItem.selected) {
      data.forEach((currentShoe) => {
        for (let key in currentShoe) {
          if (Object.values(currentShoe).indexOf(sizeItem.value) > -1) {
            isSizeFound = true;
            selectedSize = currentShoe.size;
          }
        }
      });
    }
  });
  return isSizeFound;
}

function findBrand(brandOptions) {
  let isBrandFound = false;

  brandOptions.forEach((brandItem) => {
    if (brandItem.selected) {
      data.forEach((currentShoe) => {
        for (let key in currentShoe) {
          if (Object.values(currentShoe).indexOf(brandItem.value) > -1) {
            isBrandFound = true;
            selectedBrand = currentShoe.brand;
          }
        }
      });
    }
  });
  return isBrandFound;
}

function addToCart() {
  let colorOptions = document.querySelectorAll('.colorOption');
  let sizeOptions = document.querySelectorAll('.sizeOption');
  let brandOptions = document.querySelectorAll('.brandOption');

  let isColorOptionFound = findColor(colorOptions);
  let isSizeOptionFound = findSize(sizeOptions);
  let isBrandOptionFound = findBrand(brandOptions);

  let selectedColorOption;
  let selectedSizeOption;
  let selectedBrandOption;

  if (isColorOptionFound && isSizeOptionFound && isBrandOptionFound) {
    for (let i = 0; i < data.length; i++) {
      let currentItem = data[i];

      colorOptions.forEach((colorOption) => {
        if (colorOption.selected) {
          selectedColorOption = colorOption.value;
        }
      });
      sizeOptions.forEach((sizeOption) => {
        if (sizeOption.selected) {
          selectedSizeOption = sizeOption.value;
        }
      });
      brandOptions.forEach((brandOption) => {
        if (brandOption.selected) {
          selectedBrandOption = brandOption.value;
        }
      });

      if (currentItem.color == selectedColorOption && currentItem.size == selectedSizeOption && currentItem.brand == selectedBrandOption) {
        let basketList = shoeCatalogueInstance.getBasketList();
        if (currentItem.in_stock >= 1) {
          currentItem.in_stock--;
          basketList.push(currentItem);
          let list = { basketList };
          createBasketHTML(list)
          document.querySelector('.cartTotal').innerHTML = shoeCatalogueInstance.calculateCartTotal(basketList);
          createShoeHTML(currentItem)
          shoeCatalogueInstance.updateBasketCounter();
          document.querySelector('.fa-stack[data-count]').setAttribute("data-count", shoeCatalogueInstance.getBasketCounter());

          return;
        } else {
          document.querySelector('.errorMsg').style.display = "block";
          document.querySelector('.errorMsg').innerHTML = "Item: OUT OF STOCK";
          document.querySelector('.shoeInfo').innerHTML = "No Data Found...";
          document.querySelector('.shoeInfo').classList.add('animated', 'fadeIn', 'warning');
          return;
        }

      }

    };
  }
}

function cancelBasket() {
  let basketList = shoeCatalogueInstance.getBasketList()
  let shoesList = shoeCatalogueInstance.getShoeList();
  let currentShoe = shoeCatalogueInstance.getCurrentItem(basketList, shoesList);

  shoeCatalogueInstance.cancelCart(basketList, data)

  shoeCatalogueInstance.clearBasket(basketList);
  shoeCatalogueInstance.resetBasketCounter();
  document.querySelector('.fa-stack[data-count]').setAttribute("data-count", shoeCatalogueInstance.getBasketCounter());

  document.querySelector('.cartItems').innerHTML = "";
  document.querySelector('.cartTotal').innerHTML = "0.00";

  createShoeHTML(currentShoe[0]);
}

function checkoutBtnClicked() {
  shoeCatalogueInstance.clearBasket(basketList);
  document.querySelector('.cartItems').innerHTML = "";
  document.querySelector('.cartTotal').innerHTML = "0.00";

  shoeCatalogueInstance.resetBasketCounter();
  document.querySelector('.fa-stack[data-count]').setAttribute("data-count", shoeCatalogueInstance.getBasketCounter());

}

let basketList = shoeCatalogueInstance.getBasketList();
let cartList = { basketList }

createBasketHTML(cartList);
document.querySelector('.cartTotal').innerHTML = shoeCatalogueInstance.calculateCartTotal(basketList);



Handlebars.registerHelper('calcCartTotal', function () {
  return shoeCatalogueInstance.calculateCartTotal(basketList).toFixed(2);
});

function createBasketHTML(list) {
  let rawTemplate = document.querySelector('.shoesTemplate').innerHTML;
  let compiledTemplate = Handlebars.compile(rawTemplate);
  let ourGeneratedHTML = compiledTemplate(list);

  let cartItemsElem = document.querySelector('.cartItems');
  cartItemsElem.innerHTML = ourGeneratedHTML;
}

function createShoeHTML(item) {
  let rawTemplate = document.querySelector('.myTemplate').innerHTML;
  let compiledTemplate = Handlebars.compile(rawTemplate);
  let ourGeneratedHTML = compiledTemplate(item);
  let displayDataElem = document.querySelector('#displayData');
  displayDataElem.innerHTML = ourGeneratedHTML;
}

function createColorsHTML(colorsList) {
  let rawTemplate = document.querySelector('.colorsTemplate').innerHTML;
  let compiledTemplate = Handlebars.compile(rawTemplate);
  let ourGeneratedHTML = compiledTemplate(colorsList);
  let displayDataElem = document.querySelector('.colorOptions');
  displayDataElem.innerHTML = ourGeneratedHTML;
}

function createSizesHTML(sizesList) {
  let rawTemplate = document.querySelector('.sizesTemplate').innerHTML;
  let compiledTemplate = Handlebars.compile(rawTemplate);
  let ourGeneratedHTML = compiledTemplate(sizesList);
  let displayDataElem = document.querySelector('.sizeOptions');
  displayDataElem.innerHTML = ourGeneratedHTML;
}

function createBrandsHTML(brandsList) {
  let rawTemplate = document.querySelector('.brandsTemplate').innerHTML;
  let compiledTemplate = Handlebars.compile(rawTemplate);
  let ourGeneratedHTML = compiledTemplate(brandsList);
  let displayDataElem = document.querySelector('.brandOptions');
  displayDataElem.innerHTML = ourGeneratedHTML;
}

function addNewShoe() {
  document.querySelector('.addNew-wrapper').style.display = "block";
}

cancelAddNewBtn.addEventListener('click', () => {
  document.querySelector('.addNew-wrapper').style.display = "none";
});

addNewBtnElem.addEventListener('click', addNewShoe);

addBtnElem.addEventListener('click', storeShoe);

cancelCartBtn.addEventListener('click', cancelBasket)

searchBtn.addEventListener('click', searchShoes);

addToCartBtn.addEventListener('click', addToCart);

checkoutBtn.addEventListener('click', checkoutBtnClicked);

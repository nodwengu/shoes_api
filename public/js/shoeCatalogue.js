function createShoeCatalogue(data, colors, sizes, brands) {  
   let color = "";
   let size = "";
   let brand = "";
   let price = 0.00;
   let in_stock = 0;
   let imgUrl = "";
   let shoesList = data || [];
   let basketList = [];

   let basketCouter = 0;

   let colorsAdded = colors || {};
   let sizesAdded = sizes || {};
   let brandsAdded = brands || {};

   let selectedColor = "";
   let selectedSize = "";
   let selectedBrand = "";

   function setShoe(theColor, theSize, theBrand, thePrice, theStock, theImgUrl) {
      color = theColor.charAt(0).toUpperCase() + theColor.slice(1);;
      size = theSize;
      brand = theBrand.charAt(0).toUpperCase() + theBrand.slice(1);;
      price = thePrice.toFixed(2);
      in_stock = theStock;
      imgUrl = theImgUrl;
   }
   function setShoeList() {
      shoesList.push({
         color,
         size,
         brand,
         price,
         in_stock,
         imgUrl
      });
   }
   function setBasketList(items) {
      basketList.push(items);
   }
   function getShoeList() {
      return shoesList;
   }
   function getBasketList() {
      return basketList;
   }
   
   function getColor() {
      return color;
   }
   function getSize() {
      return size;
   }
   function getBrand() {
      return brand;
   }
   function getPrice() {
      return price;
   }
   function getInStock() {
      return in_stock;
   }

   function getImgUrl() {
      return imgUrl;
   }

   function updateBasketCounter() {
      basketCouter++;
   }
   function resetBasketCounter() {
      basketCouter = 0;
   }
   
   function getBasketCounter() {
      return basketCouter;
   }


   function getSelectedColor() {
      return selectedColor;
   }

   function getSelectedSize() {
      return selectedSize;
   }

   function getSelectedBrand() {
      return selectedBrand;
   }

  
   function getColorsAdded() {
      return colorsAdded;
   }

   function getSizesAdded() {
      return sizesAdded;
   }

   function getBrandsAdded() {
      return brandsAdded;
   }
  
   function updateShoe(listItems) {
      listItems.forEach(listItem => {
         if(listItem.color === color && listItem.size === size && listItem.brand === brand) {
            //update the current element quantity
            listItem.price = price;
            listItem.imgUrl = imgUrl;
            listItem.in_stock = in_stock;
         } 
      });
   }

   function setColorsAdded(list) {
      list.forEach(listItem => {
         let color = listItem.color;

         if (colorsAdded[color] === undefined){
            //add an entry for the color in the Object Map
            colorsAdded[color] = 0;
        } else {
           colorsAdded[color]++;
        }
      });
   }

   function setSizesAdded(list) {
      list.forEach(listItem => {
         let size = listItem.size;

         if (sizesAdded[size] === undefined){
            //add an entry for the size in the Object Map
            sizesAdded[size] = 0;
        } else {
           sizesAdded[size]++;
        }
      });
   }

   function setBrandsAdded(list) {
      list.forEach(listItem => {
         let brand = listItem.brand;

         if (brandsAdded[brand] === undefined){
            //add an entry for the brand in the Object Map
            brandsAdded[brand] = 0;
        } else {
           brandsAdded[brand]++;
        }
      });
   }

   function calculateCartTotal(items) {
      let total = items.reduce((total, item) => (total += Number(item.price)), 0)
      return total.toFixed(2);
   }

   
   function clearBasket(basketList) {
      basketList.length = 0;
   }

   function cancelCart(basketList, shoesList) { 
      basketList.forEach(cartItem => {
         shoesList.map(shoeItem => {
            if(cartItem.color == shoeItem.color && cartItem.size == shoeItem.size && cartItem.brand == shoeItem.brand) {
               return shoeItem.in_stock++;
            }
         })
      });
   }

   function checkInput(list) {
      let isInputRepeated = false;
      //console.log(shoesList);
      shoesList.forEach( (item) => {
         if(item.color === color && item.size === size && item.brand === brand) {
            isInputRepeated = true;
         }
      })
      // const isInputRepeated = shoesList.filter(item => item.color === color && item.size === size && item.brand === brand);   
       return isInputRepeated
   }

   //RETURN THE CURRENT ITEM IF IT IS FOUND IN THE LIST
   function getCurrentItem(basketList, shoesList) {
      let currentItem = {}
      basketList.forEach(cartItem => {
         currentItem = shoesList.filter(shoeItem => {
            if(cartItem.color == shoeItem.color && cartItem.size == shoeItem.size && cartItem.brand == shoeItem.brand) {
               return true
            }
         })
      });
      return currentItem;
   }
   

   return {
      setShoe,
      setShoeList,
      setColorsAdded,
      setSizesAdded,
      setBrandsAdded,
      setBasketList,
     
      getColor,
      getSize,
      getBrand,
      getPrice,
      getInStock,
      getImgUrl,
      getShoeList,
      getBasketList,

      getColorsAdded,
      getSizesAdded,
      getBrandsAdded,
     
     
      calculateCartTotal,
      clearBasket,
      getSelectedColor,
      getSelectedSize,
      getSelectedBrand,
      updateShoe,

      cancelCart,
      checkInput,

      getCurrentItem,
      updateBasketCounter,
      getBasketCounter,
      resetBasketCounter
   }
}



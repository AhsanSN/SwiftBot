import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the PservicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PservicesProvider {

  hotels: any;
  hotelsTemp: any;
  bookings: any;
  bookingsTemp: any;
  bookingDetailsTemp: any;
  bookingDetails: any;
  reviews: any;
  reviewsTemp: any;
  favoriteCounter: number = 0;
  favorites: Array<any> = [];
  cart: any;
  nPeopleBooking: string;
  address: string;
  resturantId: number
  account: any;

  name: string;
  email: string;
  userIdTag: string;
  password: string;

  createBooking: any;

 
  constructor(public storage: Storage) {
    //this.hotels = HOTELS;
    /**
    this.hotels = 
    [
      {
        id:1,
        name: "Pearl continental hardcoded",
        rating: 4,
        image: "image",
        location: {
          lat: -22.906847,
          lon: -43.172896,
        },
        thumb: "assets/img/hotel/thumb/hotel_1.jpg"
      }
    ]
     */
    this.cart = []
    this.getResturantsFromStorageOnLogin()
    this.checkifAccount();
    this.getResturantsFromServer();
    
    this.bookings = []
    this.bookingDetails = []
    this.reviews = []
    
  }

  checkifAccount(){
    
    this.storage.get('userBasicInfo').then((val) => {
        console.log("account value found", val)
      if (val===null){
        //console.log("no account found. Error!!!", val);
        this.account = null;
        //this.setRoot('page-register');
      }
      else{
        this.account = val;
        this.userIdTag = val.userIdTag
        this.address = val.address;
        this.getBookingsFromServer(this.userIdTag);
        
        this.name = val.name;
        this.email = val.email;
        this.password = val.password;
        
        //console.log("account found", val);
        
        this.createBooking = {
          'userIdTag': this.userIdTag,
          'senderLocation': '',
          'receiverId': '',
        } 
        console.log("initialized")
      }
    });
     
    1;
  }

  getAcountStatus(){
    console.log("curr account status", this.account)
    return this.account
  }
 

  getResturantsFromStorageOnLogin(){
    this.storage.get('resturants').then((val) => {

      if (val===null){
        //console.log("no hotels found. Error!!!", val);
      }
      else{
        this.hotels = val;
        console.log("this.hotels", this.hotels)
        //console.log("some hotels found", val);    
      }
    }); 
  }
  
  getAddress(){
    return this.address;
  }

  getResturantsFromServer(){
    var InitiateGetTransactions = function(callback) // How can I use this callback?
     {
         var request = new XMLHttpRequest();
         request.onreadystatechange = function()
         {
             if (request.readyState == 4 && request.status == 200)
             {
                 callback(request.responseText); // Another callback here
             }
             if (request.readyState == 4 && request.status == 0)
             {
                 //console.log("no response for resturants") // Another callback here
             }
         }; 
         request.open("POST", "https://api.anomoz.com/api/fooPan/post/read_all_menu_and_resturants.php");
         request.send();
     }
     
     var _this = this;
     var frameTransactions = function mycallback(data) {
      _this.hotelsTemp = []
       //console.log("resturants received from server," , data)
       var dataParsed
       dataParsed = JSON.parse(data);
       if(dataParsed.message=="none"){
         //console.log("no resturants")
       }
       else{
         var sampleTrans = dataParsed
           //console.log(sampleTrans)
           for (var i=0; i<sampleTrans.length; i++){
          	//check if hotel already
          	if(!_this.doesHotelExist(_this.hotelsTemp, sampleTrans[i].resId)){
          		//console.log("new hotel")
          		var a = {
          			id: sampleTrans[i].resId,
          			name: sampleTrans[i].resName,
	              	rating: sampleTrans[i].resRating,
	              	image: sampleTrans[i].resImage,
	              	location: {
	                	lat: parseFloat(sampleTrans[i].resLat),
	                	lon: parseFloat(sampleTrans[i].resLng),
	              	},
	              	thumb: "https://projects.anomoz.com/allSet/portal/itemImages/"+sampleTrans[i].resImage,
	              	menu: [
	              	]
          		}
          		

          		//check if food normal or adon
          		if(sampleTrans[i].childOf==0){
          			var food = {
          				id: sampleTrans[i].foodId,
	                  	name: sampleTrans[i].foodName,
	                  	about: sampleTrans[i].foodAbout,
                      price: sampleTrans[i].foodPrice,
                      category: sampleTrans[i].foodCat,
	                  	thumb: "https://projects.anomoz.com/allSet/portal/itemImages/"+sampleTrans[i].foodImage,
	                  	addons:[]
	                  }
	                  a.menu.push(food)
          			}
          			if(sampleTrans[i].childOf!=0 && sampleTrans[i].childOf!=null){
	          			var addon = {
	          				id: sampleTrans[i].foodId,
		                  	name: sampleTrans[i].foodName,
		                  	price: sampleTrans[i].foodPrice,
		                  }
	          			//addon - find food id
	          			a.menu.forEach((val, i) => {
					        if (val.id === sampleTrans[i].childOf) {
					          a.menu[i].addons.push(addon)
					        }
					      });
          			a.menu.push(food)
          		}
          		_this.hotelsTemp.push(a)
          	}
          	else{
          		//check if food normal or adon
          		if(sampleTrans[i].childOf==0){
          			var food = {
          				id: sampleTrans[i].foodId,
	                  	name: sampleTrans[i].foodName,
	                  	about: sampleTrans[i].foodAbout,
                      price: sampleTrans[i].foodPrice,
                      category: sampleTrans[i].foodCat,
	                  	thumb: "https://projects.anomoz.com/allSet/portal/itemImages/"+sampleTrans[i].foodImage,
	                  	addons:[]
	                  }
	                  //find hotel to push to
	                  _this.hotelsTemp.forEach((val, i) => {
					        if (val.id === sampleTrans[i].resId) {
					          _this.hotelsTemp[i].menu.push(food)
					        }
					      });

          			}
          		if(sampleTrans[i].childOf!=0 && sampleTrans[i].childOf!= null ){
          			
	          			var addon = {
	          				id: sampleTrans[i].foodId,
		                  	name: sampleTrans[i].foodName,
		                  	price: sampleTrans[i].foodPrice,
		                  }

	          		//find hotel to push to
	          		var indeces = _this.getHotelAndItemIndex(_this.hotelsTemp, sampleTrans[i].resId, sampleTrans[i].childOf);
	          		var hotelIndex = indeces[0];
	                var menuItemIndex = indeces[1];
	                _this.hotelsTemp[hotelIndex].menu[menuItemIndex].addons.push(addon)

	                  
          		}
          			
            }
          }
          //add to local storage
          _this.hotels = _this.hotelsTemp
          //console.log("resturants storage updated", _this.hotels)
          _this.storage.set('resturants', _this.hotels);
       }
     }
     InitiateGetTransactions(frameTransactions); //passing mycallback as a method 
  }

  toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }


  getBookingsFromServer(userIdTag){
    var InitiateGetTransactions = function(userIdTag, callback) // How can I use this callback?
     {
         var request = new XMLHttpRequest();
         request.onreadystatechange = function()
         {
             if (request.readyState == 4 && request.status == 200)
             {
                 callback(request.responseText); // Another callback here
             }
             if (request.readyState == 4 && request.status == 0)
             {
                 //console.log("no response for resturants") // Another callback here
             }
         }; 
         //console.log("sending _this.userIdTag to server", userIdTag)
         request.open("POST", "https://api.anomoz.com/api/fooPan/post/read_bookings_of_user.php?userIdTag="+userIdTag);
         request.send();
     }
     
     var _this = this;
     var frameTransactions = function mycallback(data) {
      _this.bookingsTemp = []
       //console.log("bookings received from server," , data)
       var dataParsed
       dataParsed = JSON.parse(data);
       if(dataParsed.message=="none"){
         //console.log("no bookings")
       }
       else{
         var sampleTrans = dataParsed
           //console.log(sampleTrans)
           for (var i=0; i<sampleTrans.length; i++){
            //check if hotel already
              var a = {
                status: sampleTrans[i].status,
                resId: sampleTrans[i].resId,
                cartId: sampleTrans[i].cartId,
                resName: sampleTrans[i].resName,
                timeDine: sampleTrans[i].timeDine,
                timeBooked: (_this.toDateTime(sampleTrans[i].timeBooked)).toString().slice(0, 25),
                nPeople: sampleTrans[i].nPeople,
                totalBill: sampleTrans[i].cost,
                thumb: "https://projects.anomoz.com/allSet/portal/itemImages/"+sampleTrans[i].resImage,
                rating: sampleTrans[i].rating
            }
            _this.bookingsTemp.push(a)
          	
          }
          //add to local storage
          _this.bookings = _this.bookingsTemp
          //console.log("bookings storage updated", _this.bookings)
          //_this.storage.set('resturants', _this.hotels);
       }
     }
     InitiateGetTransactions(userIdTag, frameTransactions); //passing mycallback as a method 
  }

  getBookingDetailsFromServer(userIdTag){
    var InitiateGetTransactions = function(userIdTag, callback) // How can I use this callback?
     {
         var request = new XMLHttpRequest();
         request.onreadystatechange = function()
         {
             if (request.readyState == 4 && request.status == 200)
             {
                 callback(request.responseText); // Another callback here
             }
             if (request.readyState == 4 && request.status == 0)
             {
                 //console.log("no response for resturants") // Another callback here
             }
         }; 
         //console.log("sending _this.userIdTag to server", userIdTag)
         request.open("POST", "https://api.anomoz.com/api/fooPan/post/read_booking_details.php?cartId="+userIdTag);
         request.send();
     }
     
     var _this = this;
     var frameTransactions = function mycallback(data) {
      _this.bookingDetailsTemp = []
       console.log("booking details received from server," , data)
       var dataParsed
       dataParsed = JSON.parse(data);
       if(dataParsed.message=="none"){
         //console.log("no bookings")
       }
       else{
         var sampleTrans = dataParsed
           //console.log(sampleTrans)
           for (var i=0; i<sampleTrans.length; i++){
            //check if hotel already
            var a = {
              resEmail: sampleTrans[i].resEmail,
              resName: sampleTrans[i].resName,
              resId: sampleTrans[i].resId,
              address: sampleTrans[i].address,
              item: sampleTrans[i].item,
              quantity: sampleTrans[i].quantity,
              price: sampleTrans[i].price,
              rating: sampleTrans[i].rating,
              review: sampleTrans[i].review,
              status: sampleTrans[i].status
          }          

            _this.bookingDetailsTemp.push(a)
          	
          }
          //add to local storage
          _this.bookingDetails = _this.bookingDetailsTemp
          console.log("_this.bookingDetails", _this.bookingDetails)
          //console.log("bookings storage updated", _this.bookings)
          //_this.storage.set('resturants', _this.hotels);
       }
     }
     InitiateGetTransactions(userIdTag, frameTransactions); //passing mycallback as a method 
  }

  getAll() {
    return this.hotels;
  }

  getItem(id) {
    for (var i = 0; i < this.hotels.length; i++) {
      if (this.hotels[i].id === parseInt(id)) {
        return this.hotels[i];
      }
    }
    return null;
  }

  removeItemFromCart(itemId){
    var tempCart = []
    this.cart.forEach((val, i) => {
      if (val.itemId === itemId) {
      }
      else{
        tempCart.push(val)
      }
    });
    this.cart = tempCart;
    return this.cart
  }

  addItemToCart(itemId, quantity, addon=false, mainItemId){
    //get item name
    var tempMenu = this.getMenuOfResturant(this.resturantId);
    var tempAddons = this.getAddonsOfResturant(this.resturantId, mainItemId)
    var tempItemName;
    var tempItemPrice;

    if(addon==false){
      tempMenu.forEach((val, i) => {
        if (val.id === itemId) {
          tempItemName = val.name
          tempItemPrice =  val.price
        }
      });
  
  
      var a = {
        itemId: itemId,
        itemName: tempItemName,
        itemQuantity: quantity,
        itemPrice: tempItemPrice,
      }
      this.cart.push(a);
      
    }
    else{
      //console.log("tempMenu2", tempAddons)
      
      tempAddons.forEach((val, i) => {
        if (val.id === itemId) {
          tempItemName = val.name
          tempItemPrice =  val.price
        }
      });
  
  
      var a = {
        itemId: itemId,
        itemName: tempItemName,
        itemQuantity: quantity,
        itemPrice: tempItemPrice,
      }
      this.cart.push(a);
       
    }

    //console.log("item pushed: new cart= ",this.cart)
  }

  getCartItems(){
    return this.cart;
  }

  remove(item) {
    this.hotels.splice(this.hotels.indexOf(item), 1);
  }

  /////
  //For Search and Favorites
  ////

  getMenuOfResturant(resturantId){
    var hotelTemp;
    this.hotels.forEach((val, i) => {
      ////console.log("val.id", val.id)
      if (val.id == resturantId) {
        hotelTemp =  val.menu;
      }
    });
    return hotelTemp;
  }

  getAddonsOfResturant(resturantId, itemId){
    var hotelTempAddons = [];
    var hotelTempMenu;
    this.hotels.forEach((val, i) => {
      ////console.log("val.id", val.id)
      if (val.id == resturantId) {
        hotelTempMenu = val.menu
        hotelTempMenu.forEach((valAdd, i) => {
          if(valAdd.id==itemId){
            hotelTempAddons = (valAdd.addons)
          }
        });
      }
    });
    return hotelTempAddons;
  }

  getItemFromMenu(ItemId, resturantId){
    //console.log("getItemFromMenu called")
    var menu = this.getMenuOfResturant(resturantId);
    var ItemTemp;
    menu.forEach((val, i) => {
      if (val.id == ItemId) {
        ItemTemp =  val;
      }
    });
    return ItemTemp;
  }

  findAll() {
    return Promise.resolve(this.hotels);
  }

  findById(id) {
    return Promise.resolve(this.hotels[id - 1]);
  }

  findByName(searchKey: string) {
    let key: string = searchKey.toUpperCase();
    return Promise.resolve(this.hotels.filter((property: any) =>
        (property.title +  ' ' +property.address +  ' ' + property.city + ' ' + property.description).toUpperCase().indexOf(key) > -1));
  }

  getFavorites() {
    return Promise.resolve(this.favorites);
  }



  favorite(hotel) {
    this.favoriteCounter = this.favoriteCounter + 1;
    let exist = false;

    if (this.favorites && this.favorites.length > 0) {
      this.favorites.forEach((val, i) => {
        if (val.hotel.id === hotel.id) {
          exist = true
        }
      });
    }

    if (!exist) {
      this.favorites.push({id: this.favoriteCounter, hotel: hotel});
    }

    return Promise.resolve();
  }

  unfavorite(favorite) {
    let index = this.favorites.indexOf(favorite);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
    return Promise.resolve();
  }

  setNPeople(nPeopleBooking){
    this.nPeopleBooking = nPeopleBooking;
    //console.log("nPeopleBooking changed", nPeopleBooking)
  }

  setAddress(address){
    this.address = address;
    var tempInfo = {
      "name": this.name,
      "email": this.email,
      "password": this.password,
      "userIdTag": this.userIdTag,
      "address": this.address   
    }
    // set a key/value
    //console.log("storage updated to (signup):", tempInfo);
    this.account = tempInfo
    console.log("storing data but not", tempInfo)
    this.storage.set('userBasicInfo', tempInfo);

    //console.log("nPeopleBooking changed", nPeopleBooking)
  }

  setResturantId(resturantId){
    this.resturantId = resturantId;
    //console.log("resturantId set", resturantId);
  }

  doesHotelExist(hotels, hotelId){
  	var retValue = false;
  	hotels.forEach((val, i) => {
        if (val.id === hotelId) {
          retValue = true
        }
      });
  	return retValue;
  }

  getHotelAndItemIndex(hotels, hotelId, itemId){
  	var index = [0,0];
  	hotels.forEach((valHotel, i) => {
  	
        if (valHotel.id == hotelId) {
        	//hotel found - now search for menu
        	 hotels[i].menu.forEach((valMenu, iMenu) => {
		        if (valMenu.id === itemId) {
		        	//hotel found - now search for menu
		        	index[0] = i;
		        	index[1] = iMenu;
		        }
		      });
          
        }
        
      });
  	return index;

  }

  getResturantName(resId){
    var hotelTemp;
    //console.log("hotels 1",resId,  this.hotels, this.hotelsTemp)
    this.hotels.forEach((val, i) => {
      //console.log("val.id", val.id, resId)
      if (val.id == resId) {
        hotelTemp =  val.name;
        //console.log("yes returning", val.name)
      }
    });
    //console.log("returning", hotelTemp)
    return hotelTemp;
  }

  storeSignupData(name, email, password, userIdTag){
    this.name = name;
    this.email = email;
    this.password = password;
    this.userIdTag = userIdTag;

    var tempInfo = {
      "name": this.name,
      "email": this.email,
      "password": this.password,
      "userIdTag": this.userIdTag,
      "address": ''    
    }
    // set a key/value
    //console.log("storage updated to (signup):", tempInfo);
    this.account = tempInfo
    console.log("storing data", tempInfo)
    this.storage.set('userBasicInfo', tempInfo);
  }

  getBookings() {
    return this.bookings//Promise.resolve(this.bookings);
  }

  getBookingDetails(){
    console.log("getBookingDetails", this.bookingDetails)
    return this.bookingDetails;
  }

  doesCartItemExist(cart, cartId){
  	var retValue = false;
  	cart.forEach((val, i) => {
        if (val.cartId=== cartId) {
          retValue = true
        }
      });
  	return retValue;
  }

  getReviews(){
    return this.reviews
  }
  
}

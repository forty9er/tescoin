"use strict";

tescoinSearch.controller('TescoinSearchController', ['$http', '$resource', function($http, $resource) {
	var self = this;
  self.activeTab = 1;
  self.searchedProducts = [];
  self.searchResource = $resource('https://bittylicious.com/api/v1/quote/BTC/GB/GBP/BANK/1/BUY');

      self.isActiveTab = function(num) {
        return (self.activeTab === num);
      };

      self.setTab = function(num) {
        self.activeTab = num;
      };

      self.getBittylicious = function() {
              return self.searchResource.get();
      };

      self.getBitcoinRate =function() {
        var bittyliciousObject = self.getBittylicious();
        bittyliciousObject.$promise.then(function(data) {
          self.bitcoinRate = data.totalPrice;
        });
      };

      self.convertPrice = function(poundPr) {
        return (poundPr / self.bitcoinRate).toFixed(5);
      };

      self.convertImage = function(imgString) {
        return (imgString.replace("90x90", "540x540"));
      };

      self.getInfo = function() {
       var products =  self.searchResult.Products;
        for (var i = 0; i < products.length; i++) {
          var item = {};
          item.price = self.convertPrice(products[i].Price);
          item.pName = products[i].Name;
          item.img = self.convertImage(products[i].ImagePath);
          item.unitPrice = self.convertPrice(products[i].UnitPrice);
          item.unitType = products[i].UnitType;
          self.searchedProducts.push(item);
        }
        console.log(self.searchedProducts);
      };

	    self.doSearch = function() {
        self.clearSearchResults();
        $http.jsonp(self.createUrlString())
              .success(function(data){
                self.searchResult = data;
                      self.getInfo();
              });

        self.getBitcoinRate();
	    };

      self.clearSearchResults = function() {
        self.searchedProducts = [];
      };

	    self.createUrlString = function() {
				return "https://secure.techfortesco.com/tescolabsapi/restservice.aspx?command=PRODUCTSEARCH&searchtext=".concat(self.searchTerm).concat("&page=1&sessionkey=").concat(self.sessionKey).concat("&JSONP=JSON_CALLBACK");
      };
}]);
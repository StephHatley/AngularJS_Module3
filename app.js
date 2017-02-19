(function() {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'menuItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'items',
    bindToController: true
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowList = this;
  narrowList.found = [];
  narrowList.searchTerm = "";
  narrowList.nothingFound = false;
  //narrowList.items = MenuSearchService(tempTerm);

  narrowList.search = function () {
    if (narrowList.searchTerm ==='') {
      narrowList.nothingFound = true;
      narrowList.found = [];
      return;
    };
    var promise =  MenuSearchService.getMatchedMenuItems(narrowList.searchTerm);
    promise.then(function (response){
      narrowList.found = response;
      if (narrowList.found.length > 0) {
          narrowList.nothingFound = false;
      } else {
        narrowList.nothingFound = true;
      }
    });
  };

  narrowList.removeItem = function (index){
    narrowList.found.splice(index, 1);
  };

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
 var service = this;

 service.getMatchedMenuItems = function (searchTerm) {
   return $http({
      method: "GET",
      url:  "http://davids-restaurant.herokuapp.com/menu_items.json"
   }).then(function (result) {
     //process result and only keep items that match
     var foundSearchItems = [];
     var menu = result.data.menu_items;
     //console.log(menu);
     //console.log(menu.length);
     for(var i = 0; i < menu.length; i++) {
       var des = menu[i].description;
       if(des.includes(searchTerm)) {
         foundSearchItems.push(menu[i]);
       }
     };
     console.log(foundSearchItems.length);
     console.log(foundSearchItems);
     //return processed items
     return foundSearchItems;
   });
 };


}




})();

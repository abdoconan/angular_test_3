(function(){
    'use strict'; 
    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('GetMenuItems', getMenuItems)
    .service("FilterService", filterService)
    .service("RemoveThis", removeThis)
    .service("LoadJSON", loadJSON)
    .constant('restUrl', 'http://davids-restaurant.herokuapp.com/menu_items.json');

    NarrowItDownController.$inject = ['GetMenuItems','FilterService','RemoveThis', 'LoadJSON'];
    function NarrowItDownController(GetMenuItems,FilterService,RemoveThis,LoadJSON){
        var ctrl = this;
    
        ctrl.key = "";
        var promise = GetMenuItems.get_items();
        promise
        .then(function(response){
            ctrl.items = response.data.menu_items;
        })
        .catch(function(error){
            console.log(error);
        });

        // var localpromis = LoadJSON.load_json();

        // localpromis
        // .then(function(response){
        //     ctrl.items = response.data.menu_items;
        // })
        // .catch(function(err){
        //     console.log(err);
        // });




        ctrl.get_filtered_items = function (){
            if(ctrl.key == "")
            {
                ctrl.nothing = true;
                ctrl.nothingToShow = false;
            }
            else{
                ctrl.nothing = false;
                ctrl.newitems = FilterService.filter(ctrl.items, ctrl.key.toLowerCase());
                if (ctrl.newitems.length == 0){
                    ctrl.nothingToShow = true;
                }
                else{
                    ctrl.nothingToShow = false;
                }
            }
        };

        ctrl.remove = function (index){
            ctrl.newitems = RemoveThis.removeItem(ctrl.newitems, index);
        };



    };


    getMenuItems.$inject = ['$http', 'restUrl']
    function getMenuItems($http, restUrl){
        var service = this;

        service.get_items = function(){
            var response = $http({
                method: "GET",
                url : (restUrl)
            });

            return response;
        };
    };

    loadJSON.$inject = ['$http']
    function loadJSON($http){
        var service = this;
        

        service.load_json = function(){
            var data = $http.get('data.json');
            return data; 
        };

    };

    function filterService(){
        var service = this;

        service.filter = function (items, key) {
            var newitems = []
            for(var i in items){
                if (items[i].description.toLowerCase().indexOf(key) === -1){
                    continue;
                }
                else{
                    newitems.push(items[i]);

                };
            };
            return newitems; 

        };
    };

    function removeThis(){
        var service = this;

        service.removeItem = function(arr, index){
            arr.splice(index, 1);
            return arr;
        };
    };
    
    



}
)();

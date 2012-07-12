// Filename: router.js
define(
  [
  'jquery',
  'underscore',
  'backbone',
  'vm'
  ], 

function ($, _, Backbone, Vm) {

  var AppRouter = Backbone.Router.extend({

    routes: {

      '/twitter'      : 'twitter',
    
      // Default - catch all
      '*actions': 'default'
    }


  });

  var initialize = function(options) {

    var appView = options.appView;
    var router  = new AppRouter(options);

    // Salmon
    router.on('route:twitter', function () {
      require(['views/twitter'], function (Twitter) {
        var twitterPage = Vm.create(appView, 'Twitter', Twitter);
        twitterPage.render();
      });
    });


    // Root Default Route
    router.on('route:default', function (actions) {

     
    });

    Backbone.history.start();
  };

  return { initialize: initialize };

});

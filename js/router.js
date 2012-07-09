// Filename: router.js
define(
  [
  'jquery',
  'underscore',
  'backbone',
  'vm'
  ], 

function ($, _, Backbone, Vm, Sidebar) {

  var AppRouter = Backbone.Router.extend({

    routes: {

      '/login'      : 'login',
      '/logout'     : 'logout',
      '/activity'   : 'activity',
      '/inbox'      : 'inbox',	
      '/survey'     : 'survey',
      '/recaps'     : 'recaps',
    
      // Default - catch all
      '*actions': 'default'
    }


  });

  var initialize = function(options) {

    var appView = options.appView;
    var router  = new AppRouter(options);

    // Login
    router.on('route:login', function () {
      require(['views/authentication/page'], function (Login) {
        var loginPage = Vm.create(appView, 'Login', Login);
        loginPage.render();
      });
    });

    // Login
    router.on('route:logout', function () {
      require(['views/authentication/page'], function (Logout) {
        var logoutPage = Vm.create(appView, 'Logout', Logout);
        logoutPage.logout();
      });
    });

    // Activity
    router.on('route:activity', function () {
      appView.sidebar.updateHighlight('.activity');
      require(['views/activity/page'], function (Activity) {
        var activityPage = Vm.create(appView, 'Activity', Activity);
        activityPage.initialize();
      });
    });

    // Inbox
    router.on('route:inbox', function () {
      appView.sidebar.updateHighlight('.inbox');
      require(['views/inbox/page'], function (Inbox) {
        var inboxPage = Vm.create(appView, 'Inbox', Inbox);
        inboxPage.render();
      });
    });

    // Survey
    router.on('route:survey', function () {
      appView.sidebar.updateHighlight('.survey');
      require(['views/survey/page'], function (Survey) {
        var surveyPage = Vm.create(appView, 'Survey', Survey);
        surveyPage.render();
      });
    });

    // Recaps
    router.on('route:recaps', function () {
      appView.sidebar.updateHighlight('.recaps');
      require(['views/recaps/page'], function (Recaps) {
        var recapsPage = Vm.create(appView, 'Recaps', Recaps);
        recapsPage.render();
      });
    });


    // Root Default Route
    router.on('route:default', function (actions) {
      appView.sidebar.updateHighlight('');
      require(['views/authentication/page'], function (Auth) {

        var authPage = Vm.create(appView, 'Auth', Auth);

        if (document.location.href.charAt(document.location.href.length-1) === '#') {
          debug.log("YOU DO NOT RENDER PAGE FOR # Links");
          authPage.render();
        } 
        else if (document.location.href.charAt(document.location.href.length-1) === '/') {

          if (window.App.authorized()) {
            window.App.sidebar.show();
          } 
          else { window.App.sidebar.hide(); }

          debug.log("Default RENDER VIA ROUTES");
          Backbone.history.navigate('/#/login', true);
        }
        else { authPage.render(); }

      });
    });

    Backbone.history.start();
  };

  return { initialize: initialize };

});

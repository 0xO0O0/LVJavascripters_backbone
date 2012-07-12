// Main.js 
//
// -- 
// Main entry point for the application
// here we declare some paths for the app
// in addition we create the app object and
// router and bind the app to the router
//
// the router will then route and load the
// proper module based on the url, and this
// will begin the application life cycle
//
require.config({

  baseUrl: "js",

  paths: {

    // Debug Logger
    debug:      'libs/debug/ba-debug.min',
    
    // Utility Libs
    date:       'libs/date/date-min',
    base64:     'libs/base64/base64-min',
    mustache:   'libs/mustache/mustache',

    // Major libraries
    jquery:     'libs/jquery/jquery-min',
    underscore: 'libs/underscore/underscore-min',         // https://github.com/amdjs
    backbone:   'libs/backbone/backbone-optamd3-min',     // https://github.com/amdjs

    // Require.js plugins
    text:   'libs/require/text',
    order:  'libs/require/order',

    // Just a short cut so we can put our html outside the js dir
    // When you have HTML/CSS designers this aids in keeping them out of the js directory
    templates: '../templates'

  },

	urlArgs: "bust=" +  (new Date()).getTime()

});

// Let's kick off the application

require(

  [
  // Dependencies
  'app',
  'router',
  'vm',

  // This libs are loaded at runtime 
  // but not based on modules rather
  // at the global scope, the order
  // is based on the list here, with
  // the top being the first and the 
  // bottom being the last file loaded
  'order!libs/debug/ba-debug.min',
  'order!libs/date/date-min',
  'order!libs/base64/base64-min',
  'order!libs/mustache/mustache'
  ], 

function(App, Router, Vm) {


  // create the appView
  var appView = Vm.create({}, 'App', App);

  // render the appView
  appView.render();

  // Initialize the application router
  // and assign the appView as a property
  Router.initialize({appView: appView}); 

});

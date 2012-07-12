define(
  [
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'events',
  'text!templates/layout.html' 
  ], 

function($, _, Backbone, Vm, Events, layoutTemplate){

  var AppView = Backbone.View.extend({

    // Properties =======================================================
    el: '.application-wrapper',

    twitterView: null,
    
    baseURL: function(path) {
      return 'http://www.twitter.com/' + path;
    },
    
    // Render View ======================================================
    // ==================================================================
    // ==================================================================
    render: function () 
    {
      this.$el.html(layoutTemplate);
      window.App = this;
    } 
    // ==================================================================
    // ==================================================================
    
  });

  return AppView;

});

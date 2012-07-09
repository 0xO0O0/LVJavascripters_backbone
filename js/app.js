define(
  [
  'jquery',
  'underscore',
  'backbone',
  'vm',
  'events',
  'text!templates/layout.html' 
  ], 

function($, _, Backbone, Vm, Events, Sidebar, Auth, layoutTemplate){

  var AppView = Backbone.View.extend({

    // Properties =======================================================
    el: '.application-wrapper',

    sidebar:      null,
    
    baseURL: function(path) {
      return 'http://localhost:3333/api/' + path;
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

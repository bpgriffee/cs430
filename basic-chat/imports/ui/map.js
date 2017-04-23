import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Locations } from '../api/locations.js';

import './map.html';

import mapsapi from 'google-maps-api';

Template.map.events({
  'click .show-map'(){
    initMap();
  },
});

function initMap() {
  var GoogleMapsLoader = require('google-maps'); // only for common js environments
  var map;
  GoogleMapsLoader.KEY = 'AIzaSyBhoQ8_9JlgO88J83OB4BJzxBGhIBV8opM&v=3.exp&';
  GoogleMapsLoader.load(function(google) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.643217, lng: -79.960964},
      zoom: 13
    });
  });
  
}

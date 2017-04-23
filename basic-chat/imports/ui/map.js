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
  var mynewlat = Locations.findOne({_id: Session.get("user_to_get").lat});
  var mylat = 39.643217;
  var mynewlng = Locations.findOne({_id: Session.get("user_to_get").long});
  var mylng = -79.960964;
  alert(mynewlat);
  alert(mynewlng);
  GoogleMapsLoader.KEY = 'AIzaSyBhoQ8_9JlgO88J83OB4BJzxBGhIBV8opM&v=3.exp&';
  GoogleMapsLoader.load(function(google) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.643217, lng: -79.960964},
      zoom: 13
    });
    var myLatLng = new google.maps.LatLng(mylat, mylng);
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      animation: google.maps.Animation.DROP,
    });
    map.panTo(myLatLng);
  });
}

function dropPoint(newLatLng) {


        var infowindow = new google.maps.InfoWindow({
            content: '<h3>Marker #'+markercount.toString()+'</h3>'+
                     '<p>Population: '+population.toString()+'\b'+
                     '<p>Pos: '+newLatLng.toString()+'</p>'
        });
        marker.addListener('click',function(){
            infowindow.open(map,marker);
        });
        markercount++;
// Need to add function here to hide/show markers/heatmap
        map.panTo(newLatLng);
        marker.setMap(map);
        heatmap.setMap(map);
    }

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js';
import { Geolocation } from 'meteor/mdg:geolocation';
import { Locations } from '../api/locations.js';

import './group_settings.html';

Template.group_settings.helpers({
  current_user_is_owner(){
    //return Groups.findOne({_id: Session.get("Group").id}).owner == Meteor.userId();
    return Session.get("Group").owner == Meteor.userId();
  },
  locations_required(){
    if(Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_locations) return "checked";
    return "";
  },
  emergency_access_required(){
    return Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_em_access;
  }
});

function set_checkboxes(){
  var mutes = Groups.findOne({_id: Session.get("Group")._id}).users_muted;
  if(mutes != null && current_user_mute_status(mutes) != null) document.getElementsByClassName("mute")[0].checked = current_user_mute_status(mutes).muted;

  var curr_group = Groups.findOne({_id: Session.get("Group")._id});
  if(curr_group == null ||  curr_group.general_settings == null || curr_group.general_settings.req_locations == null || curr_group.general_settings.req_em_access == null) return null;
  document.getElementsByClassName("req-locations")[0].checked = curr_group.general_settings.req_locations;
  document.getElementsByClassName("req-em-access")[0].checked = curr_group.general_settings.req_em_access;
}

function current_user_mute_status(users_muted){
  var len = users_muted.length;
  for(i = 0; i < len; i++)
  {
    if(users_muted[i].user_id == Meteor.userId()) return users_muted[i];
  }
  return null;
}

Template.group_settings.events({
  'click .delete'(){
      if (Groups.findOne({_id: Session.get("Group")._id}).owner == Meteor.userId())
      {
        Groups.remove(Session.get("Group")._id);
      }
      Session.set("State","Groups");
      Session.set("show_messages", true);
      Session.set("show_add_user", false);
      Session.set("show_group_permissions",false);
      Session.set("show_group_settings",false);
      Session.set("show_users", false);
  },
  'click .close-settings'(){
      Session.set("show_group_settings",false);
      Session.set("show_messages", true);
  },
  'click .save-settings'(){
      var user_id = Meteor.userId();
      Groups.update({_id: Session.get("Group")._id},{$set: {"general_settings.req_locations": document.getElementsByClassName("req-locations")[0].checked, "general_settings.req_em_access": document.getElementsByClassName("req-em-access")[0].checked}});
      var curr_mute_status = {user_id: Meteor.userId(), muted: document.getElementsByClassName("mute")[0].checked}
      Groups.update({_id: Session.get("Group")._id}, { $pull: { users_muted: { user_id: Meteor.userId()}}});
      Groups.update({_id: Session.get("Group")._id},{$addToSet: {users_muted: curr_mute_status}});
      Session.set("show_group_settings",false);
      Session.set("show_messages", true);
  },
  'click .leave-group'(){
      Groups.update({_id: Session.get("Group")._id}, {$pull: {users: Meteor.userId()}});
      if (Groups.findOne({_id: Session.get("Group")._id}).users.length == 0)
      {
        Groups.remove(Session.get("Group")._id);
      }
      Session.set("State","Groups");
      Session.set("show_messages", true);
      Session.set("show_add_user", false);
      Session.set("show_group_permissions",false);
      Session.set("show_group_settings",false);
      Session.set("show_users", false);
  },
  'click .set-location'(){
      var loc = Geolocation.latLng();
      if(loc == null) loc = Geolocation.latLng();
      if(loc == null)
      {
        alert("Could not get location.");
        return;
      }
      Locations.remove({_id: Meteor.userId()});
      Locations.insert({_id: Meteor.userId(), lat: loc.lat, long: loc.lng});
  }
});

Template.group_settings.onRendered(function(){
  set_checkboxes();
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js'

import './group_settings.html';

Template.group_settings.helpers({
  current_user_is_owner(){
    //return Groups.findOne({_id: Session.get("Group").id}).owner == Meteor.userId();
    return Session.get("Group").owner == Meteor.userId();
  },
  locations_required(){
    //return Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_locations == "true";
    if(Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_locations) return "checked";
    return "";
  },
  emergency_access_required(){
    return Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_em_access;
  }
});

function set_checkboxes(){
  var curr_group = Groups.findOne({_id: Session.get("Group")._id});
  if(curr_group == null ||  curr_group.general_settings == null || curr_group.general_settings.req_locations == null || curr_group.general_settings.req_em_access == null) return null;
  document.getElementsByClassName("req-locations")[0].checked = curr_group.general_settings.req_locations;
  document.getElementsByClassName("req-em-access")[0].checked = curr_group.general_settings.req_em_access;
}

Template.group_settings.events({
  'click .close-settings'(){
      event.preventDefault();
      Session.set("show_group_settings",false);
  },
  'click .save-settings'(){
      event.preventDefault();
      Groups.update({_id: Session.get("Group")._id},{$set: {"general_settings.req_locations": document.getElementsByClassName("req-locations")[0].checked, "general_settings.req_em_access": document.getElementsByClassName("req-em-access")[0].checked}});
      Session.set("show_group_settings",false);
  }
});

Template.group_settings.onRendered(function(){
  set_checkboxes();
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js';
import { Users } from '../api/myusers.js';

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
  var mutes = Groups.findOne({_id: Session.get("Group")._id}).users_muted;
  if(mutes != null && current_user_mute_status(mutes) != null) document.getElementsByClassName("mute")[0].checked = current_user_mute_status(mutes).muted;

  var curr_group = Groups.findOne({_id: Session.get("Group")._id});
  //var muted_list = Meteor.user().profile[0].muted;
  //var muted_list = Users.find({_id: Meteor.userId()}).muted;
  //var searchentry = {group_id: Session.get("Group")._id};
  //document.getElementsByClassName("mute")[0].checked = (muted_list != null && muted_list.indexOf(searchentry) != -1);
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
  'click .close-settings'(){
      event.preventDefault();
      Session.set("show_group_settings",false);
      Session.set("show_messages", true);
  },
  'click .save-settings'(){
      var user_id = Meteor.userId();
      event.preventDefault();
      Groups.update({_id: Session.get("Group")._id},{$set: {"general_settings.req_locations": document.getElementsByClassName("req-locations")[0].checked, "general_settings.req_em_access": document.getElementsByClassName("req-em-access")[0].checked}});
      //Users.update({_id: user_id},{$pull: {muted: {group_id: Session.get("Group")._id}}});
      var curr_mute_status = {user_id: Meteor.userId(), muted: document.getElementsByClassName("mute")[0].checked}
      Groups.update({_id: Session.get("Group")._id}, { $pull: { users_muted: { user_id: Meteor.userId()}}});
      Groups.update({_id: Session.get("Group")._id},{$addToSet: {users_muted: curr_mute_status}});
      alert(current_user_mute_status(Groups.findOne({_id: Session.get("Group")._id}).users_muted).muted);
      Session.set("show_group_settings",false);
      Session.set("show_messages", true);
  }
});

Template.group_settings.onRendered(function(){
  set_checkboxes();
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js'

import './group_permissions.html';

Template.group_permissions.helpers({

  locations_required(){
    var group = Groups.findOne({_id: Session.get("Group")._id});
    if(group == null) return false;
    if(group.general_settings == null) return false;
    if(group.general_settings.req_locations == null) return false;
    return group.general_settings.req_locations;
  },
  emergency_access_required(){
    var group = Groups.findOne({_id: Session.get("Group")._id});
    if(group == null) return false;
    if(group.general_settings == null) return false;
    if(group.general_settings.req_em_access == null) return false;
    return group.general_settings.req_em_access;
  },
  options_exist(){
    var group = Groups.findOne({_id: Session.get("Group")._id});
    if(group == null) return true;
    if(group.general_settings == null) return true;
    var em = group.general_settings.req_em_access;
    var loc = group.general_settings.req_locations;
    if(em == null) em = false;
    if(loc == null) loc = false;
    return !(em && loc);
  },

});

Template.group_permissions.events({
  'click .close-permissions'(){
      Session.set("show_group_permissions",false);
      Session.set("show_messages", true);
  },

  'click .save-permissions'(){
      var locations_box = document.getElementsByClassName("permit-locations")[0];
      var em_access_box = document.getElementsByClassName("permit-em-access")[0];
      var perm_loc_checked = (locations_box == null ? null : locations_box.checked);
      var perm_em_access_checked = (em_access_box == null ? null : em_access_box.checked);
      var curr_permission = {user_id: Meteor.userId(), permit_locations: perm_loc_checked, permit_em_access: perm_em_access_checked};
      Groups.update({_id: Session.get("Group")._id}, { $pull: { users_permissions: { user_id: Meteor.userId() } } });
      Groups.update({_id: Session.get("Group")._id},{$addToSet: {users_permissions: curr_permission}});
      Session.set("show_group_permissions",false);
      Session.set("show_messages", true);
  }
});

function set_checkboxes(){
  var permissions_set = Groups.findOne({_id: Session.get("Group")._id}).users_permissions;
  if(permissions_set == null) return;
  var permission = current_user_permissions(permissions_set);
  if(permission == null) return;
  var loc_box = document.getElementsByClassName("permit-locations")[0];
  var em_box = document.getElementsByClassName("permit-em-access")[0];
  if(loc_box != null) document.getElementsByClassName("permit-locations")[0].checked = permission.permit_locations;
  if(em_box != null) document.getElementsByClassName("permit-em-access")[0].checked = permission.permit_em_access;
}

function current_user_permissions(permissions){
  if(permissions == null) return;
  var len = permissions.length;
  for(i = 0; i < len; i++)
  {
    if(permissions[i].user_id == Meteor.userId()) return permissions[i];
  }
  return null;
}

Template.group_permissions.onRendered(function(){
  set_checkboxes();
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js'

import './group_permissions.html';

Template.group_permissions.events({
  'click .close-permissions'(){
      event.preventDefault();
      Session.set("show_group_permissions",false);
      Session.set("show_messages", true);
  },

  'click .save-permissions'(){
      event.preventDefault();
      var perm_loc_checked = document.getElementsByClassName("permit-locations")[0].checked;
      var perm_em_access_checked = document.getElementsByClassName("permit-em-access")[0].checked;
      var curr_permission = {user_id: Meteor.userId(), permit_locations: perm_loc_checked, permit_em_access: perm_em_access_checked};
      alert(curr_permission.permit_locations);
      alert(curr_permission.permit_em_access);
      Groups.update({_id: Session.get("Group")._id}, { $pull: { users_permissions: { user_id: Meteor.userId() } } });
      Groups.update({_id: Session.get("Group")._id},{$addToSet: {users_permissions: curr_permission}});
      Session.set("show_group_permissions",false);
  }
});

function set_checkboxes(){
  var permissions_set = Groups.findOne({_id: Session.get("Group")._id}).users_permissions;
  if(permissions_set == null) return;
  var permission = current_user_permissions(permissions_set);
  if(permission == null) return;
  alert(permission.permit_locations);
  alert(permission.permit_em_access);
  document.getElementsByClassName("permit-locations")[0].checked = permission.permit_locations;
  document.getElementsByClassName("permit-em-access")[0].checked = permission.permit_em_access;
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

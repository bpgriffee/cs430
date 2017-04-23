import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js';

import './user.html';

Template.user.helpers({

  current_user_is_owner(){
    return Session.get("Group").owner == Meteor.userId();
  },
  this_user_is_owner(){
    return Session.get("Group").owner == this._id;
  },
  remove_user_permitted(){
    var permit = Session.get("Group").owner == Meteor.userId() && Session.get("Group").owner != this._id;
    return permit;
  },
  check_locations_permitted(){
    if (current_group_locations_required()) return true;
    if (current_group_permissions_by_user(this._id) != null && current_group_permissions_by_user(this._id).permit_locations) return true;
    return false;
  }
});

Template.user.events({
  'click .get-location'(){
    Session.set("user_to_get", this._id);
    Session.set("show_messages", false);
    Session.set("show_add_user", false);
    Session.set("show_group_settings",false);
    Session.set("show_group_permissions",false);
    Session.set("show_users", false);
    Session.set("show_map", true);
  },
  'click .remove-user'(){
    Groups.update({_id: Session.get("Group")._id}, {$pull: {users: this._id}});
  }
});

function current_group_locations_required(){
    var group = Groups.findOne({_id: Session.get("Group")._id});
    if(group == null) return false;
    if(group.general_settings == null) return false;
    if(group.general_settings.req_locations == null) return false;
    return group.general_settings.req_locations;
}

function current_group_permissions_by_user(target_id){
  var permissions_set = Groups.findOne({_id: Session.get("Group")._id}).users_permissions;
  if(permissions_set == null) return null;
  var len = permissions_set.length;
  for(i = 0; i < len; i++)
  {
    if(permissions_set[i].user_id == target_id) return permissions_set[i];
  }
  return null;
}

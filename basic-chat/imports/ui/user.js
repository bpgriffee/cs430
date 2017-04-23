import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js';

import './user.html';

Template.user.helpers({

  current_user_is_owner(){
    return Session.get("Group").owner == Meteor.userId();
  }
});

Template.user.events({
  'click .get-location'(){
    Session.set("show_messages", false);
    Session.set("show_add_user", false);
    Session.set("show_group_settings",false);
    Session.set("show_group_permissions",false);
    Session.set("show_users", false);
    Session.set("show_map", true);
  },
  'click .remove-user'(){
    Groups.update({_id: Session.get("Group")._id}, {$pull: {users: this._id}});
  },
})

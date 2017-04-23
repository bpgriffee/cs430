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
  },
  'click .remove-user'(){
        Groups.update({_id: Session.get("Group")._id}, {$pull: {users: this._id}});
  },
})

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Groups } from '../api/groups.js';
import { Messages} from '../api/messages.js';

import './invite.html';

Template.group.events({
  'click .accept'(){
      if (Groups.findOne({_id: this._id}).owner == Meteor.userId())
      {
        Groups.remove(this._id);
      }
  },
  'click .reject'(){
    Groups.update({_id: this._id}, {$pull: {users: Meteor.userId()}});
    if (Groups.findOne({_id: this._id}).users.length == 0)
    {
      Groups.remove(this._id);
    }
  }
});

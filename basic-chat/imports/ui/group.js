import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Groups } from '../api/groups.js';
import { Messages} from '../api/messages.js';

import './group.html';

Template.group.events({
  'click .delete'(){
      if (Groups.findOne({_id: this._id}).owner == Meteor.userId())
      {
        Groups.remove(this._id);
      }
  },
  'click .leave'(){
    Groups.update({_id: this._id}, {$pull: {users: Meteor.userId()}});
    if (Groups.findOne({_id: this._id}).users.length == 0)
    {
      Groups.remove(this._id);
    }
  },
  'click .open'(){
    Session.set("State","Messages");
    group = Groups.findOne({_id: this._id}, {});
    name = group.groupname;
    Session.set("Group",this);
    alert(this._id);
  },
});

Template.group.helpers({
  current_user_is_owner(){
    return Groups.findOne({_id: Session.get("Group")._id}).owner == Meteor.userId();
  }
})

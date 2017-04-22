import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { Groups } from '../api/groups.js';

import './userentry.js';
import './userentry.html';
import './userlist.html';

Template.userlist.helpers({
  users(){
    return Meteor.users.find({_id: {$in: Groups.findOne({_id: Session.get("Group")._id}).users}});
  }
});

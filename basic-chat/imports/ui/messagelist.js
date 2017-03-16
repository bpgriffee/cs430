import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Messages } from '../api/messages.js';
import { Groups } from '../api/groups.js';
import './message.js';
import './message.html';
import './messagelist.html';

Template.messagelist.helpers({
  messages(){
    return Messages.find({ group: Session.get("Group")._id}, { sort:{createdAt:-1} });
  },
  users(){
    return Groups.findOne({_id: Session.get("Group")._id}).users;
  }
});

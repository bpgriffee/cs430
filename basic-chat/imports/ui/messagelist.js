import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Messages } from '../api/messages.js';
import './message.js';
import './message.html';
import './messagelist.html';

Template.messagelist.helpers({
  messages(){
    return Messages.find({ group: Session.get("Group")}, { sort:{createdAt:-1} });
  }
});

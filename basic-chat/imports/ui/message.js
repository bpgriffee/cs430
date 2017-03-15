import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Messages } from '../api/messages.js';
import './message.html';

Template.message.events({
  'click .delete'(){
    Messages.remove(this._id);
  },
})

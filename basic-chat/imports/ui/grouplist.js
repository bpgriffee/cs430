import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Groups } from '../api/groups.js';
import './group.html';
import './grouplist.html';
import './group.js';

Template.body.helpers({
  groups(){
    return Groups.find({}, { sort:{createdAt:-1} });
  }
});

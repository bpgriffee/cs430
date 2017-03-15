import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Groups } from '../api/groups.js';
import './group.js';
import './group.html';
import './grouplist.html';

Template.grouplist.helpers({
  groups(){
    return Groups.find({}, { sort:{createdAt:-1} });
  }
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js'

import './group_permissions.html';

Template.group_permissions.events({
  'click .close-permissions'(){
      event.preventDefault();
      Session.set("show_group_permissions",false);
  }
});

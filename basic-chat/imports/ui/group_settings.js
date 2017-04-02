import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js'

import './group_settings.html';

Template.group_settings.helpers({
  current_user_is_owner(){
    //return Groups.findOne({_id: Session.get("Group").id}).owner == Meteor.userId();
    return Session.get("Group").owner == Meteor.userId();
  }
});

Template.group_settings.events({
  'click .close-settings'(){
      event.preventDefault();
      Session.set("show_group_settings",false);
  }
});

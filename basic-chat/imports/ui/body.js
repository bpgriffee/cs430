import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Messages } from '../api/messages.js'
import { Groups } from '../api/groups.js'

import './message.js'
import './group.js'
import './grouplist.js'
import './messagelist.js'
import './group_settings.js';
import './group_permissions.js';
import './body.html';
import './group_settings.html';
import './group_permissions.html';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Session.set("State","Groups");
});

Template.body.helpers({

  outGroup(){
    return Session.get("State") == "Groups";
  },

  inGroup(){
    return Session.get("State") == "Messages";
  },

  currentGroup(){
    return Session.get("Group").groupname;
  },

  groupSettingsOpen(){
    return Session.get("show_group_settings");
  },

  groupPermissionsOpen(){
    return Session.get("show_group_permissions");
  },

});

Template.body.events({

  'click .submit-group'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = document.groupform.text;
    const groupname = target.value;
    if(groupname.trim() != "")
    {
      // Insert a group into the Collection
      Groups.insert({
        groupname,
        owner: Meteor.userId(),
        users: [Meteor.userId()]
      });
      // Clear form
      target.value = '';
    }
  },

  'click .submit-message'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = document.messageform.text;
    const messagetext = target.value;
    if(messagetext.trim() != "")
    {
      // Insert a message into the Collection
      Messages.insert({
        messagetext,
        group: Session.get("Group")._id,
        owner: Meteor.userId(),
        username: Meteor.user().username,
      });
      // Clear form
      target.value = '';
    }
  },

  'click .submit-member'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = document.addmemberform.text;
    const usertext = target.value;

    numusers = Meteor.users.find({username: usertext}).count();
    if(numusers == 1)
    {
      group_id = Session.get("Group")._id;
      Groups.update({_id: group_id},{$addToSet: {users: Meteor.users.findOne({username: usertext})._id}});
    }
    // Clear form
    target.value = '';
  },

  'click .show-groups'(event){
    event.preventDefault();
    Session.set("State","Groups");
  },

  'click .show-settings'(event){
    event.preventDefault();
    Session.set("show_group_settings",true);
  },

  'click .show-permissions'(event){
    event.preventDefault();
    Session.set("show_group_permissions",true);
  },

});

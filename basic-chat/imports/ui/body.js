import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Tasks } from '../api/tasks.js'
import { Users } from '../api/chatusers.js'
import { Messages } from '../api/messages.js'
import { Groups } from '../api/groups.js'

import './task.js'
import './message.js'
import './group.js'
import './chatuser.js'
import './grouplist.js'
import './body.html';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Session.set("State","Groups");
});

Template.body.helpers({
  tasks(){
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')){
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: {$ne: true} }, {sort:{createdAt:-1} });
    }
    // Otherwise return all of the tasks
    return Tasks.find({}, { sort:{createdAt:-1} });
  },
  groups(){
    return Groups.find({}, { sort:{createdAt:-1} });
  },
  messages(){
    return Messages.find({}, { sort:{createdAt:-1} });
  },
  groupState(){
    return Session.get("State") == "Groups";
  },
  messageState(){
    return Session.get("State") == "Messages";
  },
  currentGroup(){
    return Session.get("Group");
  }
});

Template.body.events({
  'click .submit-group'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = document.groupform.text;
    const groupname = target.value;

    // Insert a task into the Collection
    Groups.insert({
      groupname
    });
    // Clear form
    target.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  'click .submit-message'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = document.messageform.text;
    const messagetext = target.value;

    // Insert a task into the Collection
    Messages.insert({
      messagetext
    });
    // Clear form
    target.value = '';
  },
  'click .show-groups'(event){
    Session.set("State","Groups");
  },
});

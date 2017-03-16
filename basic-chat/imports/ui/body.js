import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

import { Tasks } from '../api/tasks.js'
import { Messages } from '../api/messages.js'
import { Groups } from '../api/groups.js'

import './task.js'
import './message.js'
import './group.js'
import './grouplist.js'
import './messagelist.js'
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
      groupname,
      owner: Meteor.userId(),
      users: [Meteor.userId()]
    });
    // Clear form
    target.value = '';
  },
  'click .submit-message'(event){
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = document.messageform.text;
    const messagetext = target.value;

    // Insert a task into the Collection
    Messages.insert({
      messagetext,
      group: Session.get("Group"),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    // Clear form
    target.value = '';
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
      group_id = Session.get("Group")
      Groups.update({_id: group_id},{$addToSet: {users: Meteor.users.findOne({username: usertext})._id}});
    }
    // Clear form
    target.value = '';
  },
  'click .show-groups'(event){
    event.preventDefault();
    Session.set("State","Groups");
  },
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';
import { Messages } from '../api/messages.js';
import { Groups } from '../api/groups.js';
import { Invites } from '../api/invites.js';

import './message.js';
import './group.js';
import './invite.js';
import './invite.html';
import './grouplist.js';
import './messagelist.js';
import './group_settings.js';
import './group_permissions.js';
import './group_settings.js';
import './userlist.js';
import './map.js';
import './invite_list.js';

import './body.html';
import './group_settings.html';
import './group_permissions.html';
import './login_form.html';
import './invite_list.html';
import './userlist.html';
import './map.html'


Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Session.set("State","Groups");
  Session.set("show_messages", true);
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

  groupMessagesOpen(){
    return Session.get("show_messages");
  },

  groupAddUserOpen(){
    return Session.get("show_add_user");
  },

  groupSettingsOpen(){
    return Session.get("show_group_settings");
  },

  groupPermissionsOpen(){
    return Session.get("show_group_permissions");
  },

  groupUsersOpen(){
    return Session.get("show_users");
  },

  mapIsOpen(){
    return Session.get("show_map");
  },

  set_locations_required(){
    document.getElementsByClassName("req-locations")[0].checked = Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_locations;
  },

  set_emergency_access_required(){
    document.getElementsByClassName("req-em-access")[0].checked = Groups.findOne({_id: Session.get("Group")._id}).general_settings.req_em_access;
  }

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
      group_id = Groups.insert({
        groupname,
        owner: Meteor.userId(),
        users: [Meteor.userId()],
      })._id;

      Groups.update({_id: group_id},{$set: {"general_settings.req_locations": false, "general_settings.req_em_access": false}});

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

    group_id = Session.get("Group")._id;
    Groups.update({_id: group_id},{$addToSet: {users: Meteor.users.findOne({username: usertext})._id}});
    var invite = {groupname: Groups.findOne({_id: group_id}).groupname, id: group_id};
    Invites.update({_id: Meteor.userId()},{$addToSet: {groups: invite}});
    // Clear form
    target.value = '';
  },

  'click .show-groups'(event){
    event.preventDefault();
    Session.set("State","Groups");
    Session.set("show_messages", true);
    Session.set("show_add_user", false);
    Session.set("show_group_permissions",false);
    Session.set("show_group_settings",false);
    Session.set("show_users", false);
    Session.set("show_map", false)
  },

  'click .show-messages'(event){
    event.preventDefault();
    Session.set("show_messages", true);
    Session.set("show_add_user", false);
    Session.set("show_group_permissions",false);
    Session.set("show_group_settings",false);
    Session.set("show_users", false);
    Session.set("show_map", false)
  },

  'click .show-add-user'(event){
    event.preventDefault();
    Session.set("show_messages", false);
    Session.set("show_add_user", true);
    Session.set("show_group_permissions",false);
    Session.set("show_group_settings",false);
    Session.set("show_users", false);
    Session.set("show_map", false)
  },

  'click .show-settings'(event){
    event.preventDefault();
    Session.set("show_messages", false);
    Session.set("show_add_user", false)
    Session.set("show_group_settings",true);
    Session.set("show_group_permissions",false);
    Session.set("show_users", false);
    Session.set("show_map", false)
  },

  'click .show-permissions'(event){
    event.preventDefault();
    Session.set("show_messages", false);
    Session.set("show_add_user", false);
    Session.set("show_group_settings",false);
    Session.set("show_group_permissions",true);
    Session.set("show_users", false);
    Session.set("show_map", false)
  },

  'click .show-users'(event){
    event.preventDefault();
    Session.set("show_messages", false);
    Session.set("show_add_user", false);
    Session.set("show_group_settings",false);
    Session.set("show_group_permissions",false);
    Session.set("show_users", true);
    Session.set("show_map", false);
  },

  'click .logoutbutton'(event){
    event.preventDefault();
    Meteor.logout();
    // Clear all keys
    Session.keys = {};
    location.reload();
  }

});

Template.body.onRendered(function(){
  Meteor.logout(function(){
    Session.set("show_messages", true);
    Session.set("show_add_user", false);
    Session.set("show_group_permissions",false);
    Session.set("show_group_settings",false);
    Session.set("State","Groups");
  });
});

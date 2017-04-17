import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Groups } from '../api/groups.js';
import { Invites } from '../api/invites.js'

import './invite_list.html';
import './invite.html';
import './invite.js';

Template.invite_list.events({
});

Template.invite_list.helpers({
  invites(){
    return Invites.find({_id: Meteor.userId()}).groups;
    //return Groups.find({owner: Meteor.userId()}, { sort:{createdAt:-1} });
    //return Groups.find({}, { sort:{createdAt:-1} });
  }
});

Template.invite_list.onRendered(function(){
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import { Groups } from '../api/groups.js';
import './group.js';
import './group.html';
import './grouplist.html';

Template.grouplist.helpers({
  groups(){
    return Groups.find({users: {$in: [Meteor.userId()]}}, { sort:{createdAt:-1} });
    //return Groups.find({owner: Meteor.userId()}, { sort:{createdAt:-1} });
    //return Groups.find({}, { sort:{createdAt:-1} });
  }
});

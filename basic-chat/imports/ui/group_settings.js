import { Template } from 'meteor/templating';

import './group_settings.html';

Template.group_settings.helpers({
  current_user_is_owner(){
    return Groups.findOne({_id: Session.get("Group")._id}).owner == Meteor.userId();
  }
})

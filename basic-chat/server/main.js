import { Accounts } from 'meteor/accounts-base';

import '../imports/api/groups.js';
import '../imports/api/messages.js';
import '../imports/api/invites.js';

Accounts.onCreateUser((options, user) => {
  user.profile = {};
  user.profile.invites = [];
  user.invites = [];
  return user;
});

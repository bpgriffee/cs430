import { Accounts } from 'meteor/accounts-base';

import '../imports/api/groups.js';
import '../imports/api/messages.js';
import '../imports/api/invites.js';

Accounts.onCreateUser((options, user) => {
  user.username = user.emails[0].address;
  return user;
});

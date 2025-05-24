import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

const ADD_ACCOUNT_COMMAND = {
  name: 'addaccount',
  description: 'add an account to the bot',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options:
  [{
    name: 'account_name',
    description: 'Account name to add',
    type: 3,
    required: true
  },
  {
    name: 'account_region',
    description: 'Account region to add',
    type: 3,
    required: true
  }]
};

const ALL_COMMANDS = [ADD_ACCOUNT_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

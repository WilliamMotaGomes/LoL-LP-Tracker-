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
    name: 'game_name',
    description: 'game name to add',
    type: 3,
    required: true
  },
  {
    name: 'game_tag',
    description: 'game tag to add',
    type: 3,
    required: true
  },
  {
    name: 'account_region',
    description: 'Account region to add',
    type: 3,
    required: true,
    choices: 
    [
      { name: "BR", value: "BR1" },
      { name: "EUN", value: "EUN1" },
      { name: "EUW", value: "EUW1" },
      { name: "JP", value: "JP1" },
      { name: "KR", value: "KR"  },
      { name: "LA1", value: "LA1" },
      { name: "LA2", value: "LA2" },
      { name: "ME", value: "ME1" },
      { name: "NA", value: "NA1" },
      { name: "OC", value: "OC1" },
      { name: "RU", value: "RU"  },
      { name: "SG", value: "SG2" },
      { name: "TR", value: "TR1" },
      { name: "TW", value: "TW2" },
      { name: "VN", value: "VN2" }
    ]
  }]
};

const REMOVE_ACCOUNT_COMMAND = {
  name: 'removeaccount',
  description: 'remove an account from the bot',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options:
  [{
    name: 'game_name',
    description: 'game name to remove',
    type: 3,
    required: true
  },
  {
    name: 'game_tag',
    description: 'game tag to remove',
    type: 3,
    required: true
  }]
};

const UPDATE_COMMAND = {
  name: 'update',
  description: 'update',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2]
};

const ALL_COMMANDS = [ADD_ACCOUNT_COMMAND,REMOVE_ACCOUNT_COMMAND,UPDATE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

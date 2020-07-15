import {
  AccountController
} from './controllers';

import {
  AccountService
} from './services';

import {
  AccountSchema
} from './schemas';


export const controllers = [AccountController];

export const services = [AccountService];

export const models = [
  { name: 'Account', schema: AccountSchema }
];
    
import { Schema, SchemaTypes as t, SchemaOptions } from 'mongoose';

const option: SchemaOptions = {};
option.timestamps = true;

export const AccountSchema = new Schema(
  {
    username: { type: t.String },
    password: { type: t.String },
    name: { type: t.String },
    keyword: { type: t.String },
    avatar: { type: t.String },
    type: { type: t.String },
    groups: { type: t.Array },
    roles: { type: t.Array },
    email: { type: t.String },
    mobile: { type: t.String },
    profile: { type: t.Mixed },
    isDisable: { type: t.Boolean },
    isAdmin: { type: t.Boolean },
    isApproved: { type: t.Boolean },
    secret: { type: t.String },
    expired: { type: t.Number },
    comparePassword: { type: t.Mixed },
  },
  option,
);

// AccountSchema.set('toJSON', {
//   transform,
// });

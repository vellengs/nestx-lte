``` typescript
import { Schema, SchemaTypes as t, SchemaOptions } from 'mongoose';

const option: SchemaOptions = {};
option.timestamps = true;

export const {{Domain}}Schema = new Schema(
  {
{{#each fields}}
    {{name}}: { type: t.{{type}} },
{{/each}}
  },
  option,
);

{{Domain}}Schema.set('toJSON', {
  transform,
});

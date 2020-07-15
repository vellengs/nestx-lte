``` typescript
import { ApiProperty, PartialType, OmitType, PickType } from '@nestjs/swagger';

import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
  MinLength,
  Length,
  MaxLength,
} from 'class-validator';
import { Paginate } from './../commons';
import { I{{Domain}} } from '../interfaces';

export class {{Domain}} implements I{{Domain}} {
{{#each fields}}

  @ApiProperty({ type: {{type}} })
  {{name}}: {{baseType}};
{{/each}}
}

export class {{Domain}}Dto extends {{Domain}} {}

export class Create{{Domain}}Dto extends OmitType({{Domain}}, ['id']) {}

export class Edit{{Domain}}Dto extends {{Domain}} {}

export class {{Domain}}ItemDto extends {{Domain}} {}

export class {{Domain}}PaginateDto extends Paginate<{{Domain}}ItemDto> {
  @ApiProperty({ type: [{{Domain}}ItemDto] })
  items: [{{Domain}}ItemDto];
}
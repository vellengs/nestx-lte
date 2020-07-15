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
import { IAccount } from '../interfaces';

export class Account implements IAccount {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  keyword: string;

  @ApiProperty({ type: String })
  avatar: string;

  @ApiProperty({ type: String })
  type: string;

  @ApiProperty({ type: [String] })
  groups: string[];

  @ApiProperty({ type: [String] })
  roles: string[];

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  mobile: string;

  @ApiProperty({ type: String })
  profile: string;

  @ApiProperty({ type: Boolean })
  isDisable: boolean;

  @ApiProperty({ type: Boolean })
  isAdmin: boolean;

  @ApiProperty({ type: Boolean })
  isApproved: boolean;

  @ApiProperty({ type: String })
  secret: string;

  @ApiProperty({ type: Number })
  expired: number;
}

export class AccountDto extends Account {}

export class CreateAccountDto extends OmitType(Account, ['id']) {}

export class EditAccountDto extends Account {}

export class AccountItemDto extends Account {}

export class AccountPaginateDto extends Paginate<AccountItemDto> {
  @ApiProperty({ type: [AccountItemDto] })
  items: [AccountItemDto];
}

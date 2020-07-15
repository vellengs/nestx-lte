import { ApiProperty, PartialType, OmitType, PickType } from '@nestjs/swagger';

export class KeyValue {
  @ApiProperty()
  label: string;
  @ApiProperty()
  value: string;
}

export class Result {
  @ApiProperty()
  ok: boolean;
  @ApiProperty()
  message?: string;
}

export class Query {
  @ApiProperty()
  size: number;
  @ApiProperty()
  page: number;
}

export class TreeNode {
  @ApiProperty()
  id: string;
  @ApiProperty()
  icon?: string;
  @ApiProperty()
  type?: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  parent: string;
}

export class UserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  isAdmin: boolean;
  @ApiProperty()
  roles: string[];
  @ApiProperty()
  username: string;
  @ApiProperty()
  name: string;
}

export class Paginate<T> {
  @ApiProperty()
  page: number;
  @ApiProperty()
  size: number;
  @ApiProperty()
  count: number;
  @ApiProperty()
  items: [T];
}


export class ListResult<T> {
  @ApiProperty()
  list: T[];
  @ApiProperty()
  count?: number;
  @ApiProperty()
  query?: Query;
}

export class ErrorResult {
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;
}

import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Param,
  Body,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ParseIntPipe,
} from '@nestjs/common';
import { AccountService } from '../services';
import { ErrorResult, KeyValue } from '../commons';
import {
  AccountDto,
  CreateAccountDto,
  EditAccountDto,
  AccountPaginateDto,
} from '../dto';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Account')
@Controller('core/account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get('search')
  @ApiOperation({
    operationId: 'accountSearch',
    summary: 'Account Search',
  })
  @ApiResponse({ status: 500, type: ErrorResult })
  @ApiResponse({ status: 200, type: [KeyValue] })
  async search(@Query('keyword') keyword?: string): Promise<KeyValue[]> {
    return this.service.search(keyword);
  }

  @Post('create')
  @ApiOperation({
    operationId: 'accountCreate',
    summary: 'Account Create',
  })
  @ApiResponse({ status: 200, type: AccountDto })
  async create(@Body() entry: CreateAccountDto): Promise<AccountDto> {
    return this.service.create(entry);
  }

  @Put('update')
  @ApiOperation({
    operationId: 'accountUpdate',
    summary: 'Account Update',
  })
  @ApiResponse({ status: 200, type: AccountDto })
  async update(@Body() entry: EditAccountDto): Promise<AccountDto> {
    return this.service.update(entry);
  }

  @Get('query')
  @ApiOperation({
    operationId: 'accountQuery',
    summary: 'Account Query',
  })
  @ApiResponse({ type: AccountPaginateDto })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  async query(
    @Query('name') name?: string,
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('size', new ParseIntPipe()) size = 10,
    @Query('sort') sort?: string,
  ): Promise<AccountPaginateDto> {
    return this.service.querySearch(name, page, size, sort) as any;
  }

  @Delete('delete/:id')
  @ApiOperation({
    operationId: 'accountDelete',
    summary: 'Account Delete',
  })
  @ApiResponse({ status: 200, type: Boolean })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.service.remove(id);
  }

  @Get('find-one/:id')
  @ApiOperation({
    operationId: 'accountFindOne',
    summary: 'Account Detail',
  })
  @ApiResponse({ status: 200, type: AccountDto })
  async findOne(@Param('id') id: string): Promise<AccountDto> {
    return this.service.findOne(id);
  }
}

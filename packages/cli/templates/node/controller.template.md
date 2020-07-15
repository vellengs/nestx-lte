``` typescript
import {
  Controller,
  Get,
  Query,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { {{Domain}}Service } from '../services';
import { 
  ErrorResult,
  KeyValue,} from '../commons'
import {
  {{Domain}}Dto,
  Create{{Domain}}Dto,
  Edit{{Domain}}Dto,
  {{Domain}}PaginateDto,
} from '../dto';
import { ApiTags, ApiBody, ApiQuery, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('{{Domain}}')
@Controller('{{ControllerPath}}')
export class {{Domain}}Controller {
  constructor(private readonly service: {{Domain}}Service) {}

  @Get('search')
  @ApiOperation({
    operationId: '{{domain}}Search',
    summary: '{{Domain}} Search',
  })
  @ApiResponse({ status: 500, type: ErrorResult })
  @ApiResponse({ status: 200, type: [KeyValue] })
  async search(
    @Query('keyword') keyword?: string,
  ): Promise<KeyValue[]> {
    return this.service.search(keyword);
  }

  @Post('create')
  @ApiOperation({
    operationId: '{{domain}}Create',
    summary: '{{Domain}} Create',
  })
  @ApiResponse({ status: 200, type: {{Domain}}Dto })
  async create(@Body() entry: Create{{Domain}}Dto): Promise<{{Domain}}Dto> {
    return this.service.create(entry);
  }

  @Put('update')
  @ApiOperation({
    operationId: '{{domain}}Update',
    summary: '{{Domain}} Update',
  })
  @ApiResponse({ status: 200, type: {{Domain}}Dto })
  async update(@Body() entry: Edit{{Domain}}Dto): Promise<{{Domain}}Dto> {
    return this.service.update(entry);
  }

  @Get('query')
  @ApiOperation({
    operationId: '{{domain}}Query',
    summary: '{{Domain}} Query',
  })
  @ApiResponse({ type: {{Domain}}PaginateDto })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  async query(
    @Query('name') name?: string,
    @Query('page', new NullableParseIntPipe()) page = 1,
    @Query('size', new NullableParseIntPipe()) size = 10,
    @Query('sort') sort?: string,
  ): Promise<{{Domain}}PaginateDto> {
    return this.service.querySearch(name, page, size, sort) as any;
  }

  @Delete('delete/:id')
  @ApiOperation({
    operationId: '{{domain}}Delete',
    summary: '{{Domain}} Delete',
  })
  @ApiResponse({ status: 200, type: Boolean })
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.service.remove(id);
  }

  @Get('find-one/:id')
  @ApiOperation({
    operationId: '{{domain}}FindOne',
    summary: '{{Domain}} Detail',
  })
  @ApiResponse({ status: 200, type: {{Domain}}Dto })
  async findOne(@Param('id') id: string): Promise<{{Domain}}Dto> {
    return this.service.findOne(id);
  }
}

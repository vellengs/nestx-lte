import {
  Injectable,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Id, RepositoryService } from './repository.service';
import { ObjectID } from 'typeorm';
import { ListResult } from './commons.dto';

@Injectable()
export class ControllerService<T extends Id> {
  constructor(private readonly service: RepositoryService<T>) {}

  @Get(':size/:page')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async findAll(
    @Param('page', new ParseIntPipe()) page = 1,
    @Param('size', new ParseIntPipe()) size = 10,
    @Query() query: any,
  ): Promise<ListResult<T>> {
    return await this.service.findAll(page, size, query);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string | number | Date | ObjectID,
  ): Promise<T> {
    return await this.service.findOne(id);
  }

  @Post()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async create(@Body() entity: any): Promise<T> {
    return await this.service.create(entity);
  }

  @Put()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async update(@Body() entity: any): Promise<T> {
    return await this.service.update(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<T> {
    return await this.service.remove(id);
  }
}

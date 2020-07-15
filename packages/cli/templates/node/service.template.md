``` typescript
import { Injectable } from '@nestjs/common';
import { MongooseService } from '../commons';
import { Document } from 'mongoose';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListResult } from '../commons';
import { {{Domain}} } from '../dto';

@Injectable()
export class {{Domain}}Service extends MongooseService<{{Domain}} & Document> {
  defaultQueryFields = [];
  constructor(
    @InjectModel('{{Domain}}')
    protected readonly model: Model<{{Domain}} & Document>,
  ) {
    super(model);
  }

  async querySearch(
    keyword: string,
    page: number,
    size: number,
    sort: string,
  ): Promise<ListResult<{{Domain}} & Document>> {
    return super.query(
      page,
      size,
      {},
      { keyword, field: 'name' },
      this.defaultQueryFields,
      sort,
    );
  }
}

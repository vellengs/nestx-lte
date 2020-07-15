import { Injectable } from '@nestjs/common';
import { MongooseService } from '../commons';
import { Document } from 'mongoose';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListResult } from '../commons';
import { Account } from '../dto';

@Injectable()
export class AccountService extends MongooseService<Account & Document> {
  defaultQueryFields = [];
  constructor(
    @InjectModel('Account')
    protected readonly model: Model<Account & Document>,
  ) {
    super(model);
  }

  async querySearch(
    keyword: string,
    page: number,
    size: number,
    sort: string,
  ): Promise<ListResult<Account & Document>> {
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

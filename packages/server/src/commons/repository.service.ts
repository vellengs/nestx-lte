import { Injectable } from '@nestjs/common';
import { Repository, getManager, ObjectID } from 'typeorm';
import { ListResult } from './commons.dto';

export interface Id {
  id: string | number | Date | ObjectID;
}

@Injectable()
export class RepositoryService<T extends Id> {
  constructor(private repository: Repository<T>) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async findAll(
    page: number,
    size: number,
    query: any,
  ): Promise<ListResult<T>> {
    return new Promise<ListResult<T>>(async x => {
      const result: ListResult<T> = {
        list: await this.repository.find({
          skip: size * (page - 1),
          take: size,
        }),
        count: await this.repository.count(),
        query: {
          page: page,
          size: size,
        },
      };
      x(result);
    });
  }

  async findOne(id: string | number | Date | ObjectID): Promise<T> {
    return await this.repository.findOne(id);
  }

  async create(entity: any): Promise<any> {
    return await this.repository.save(entity);
  }

  async update(entity: T): Promise<any> {
    const index = await this.repository.findOne(entity.id);
    if (index) {
      Object.assign(index, entity);
      await getManager().transaction(async transactionalEntityManager => {
        await transactionalEntityManager.save(index);
      });

      return index;
    }
  }

  async remove(id: string | number | Date | ObjectID): Promise<any> {
    const entity = await this.repository.findOne(id);
    return await this.repository.remove(entity);
  }
}

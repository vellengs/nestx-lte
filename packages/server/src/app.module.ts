import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_URI } from './utils';
import { models, controllers, services } from './registry';


console.log('URI', MONGODB_URI)

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    MongooseModule.forFeature(models),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers,
  providers: services,
})
export class AppModule {}

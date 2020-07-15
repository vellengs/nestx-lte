import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  SWAGGER_API_NAME,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_CURRENT_VERSION,
} from './constants';
import { existsSync, writeFileSync } from 'fs';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setBasePath('api')
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    // .addBearerAuth(SWAGGER_API_AUTH_NAME, SWAGGER_API_AUTH_LOCATION)
    // .setSchemes('http')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  writeFileSync('./swagger-spec.json', JSON.stringify(document));

  // writeSync('demo.json', JSON.stringify(document) );
};

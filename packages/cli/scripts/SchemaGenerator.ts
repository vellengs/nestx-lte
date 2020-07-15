import Velocity = require('velocityjs');
import { resolve, dirname } from 'path';
import lodash = require('lodash');
import dayjs = require('dayjs');
import {
  readFileSync,
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
} from 'fs';
import { Engine, Entity } from 'typeorm-model-generator';

export interface IConnectionOptions {
  host: string;
  port: number;
  databaseName: string;
  user: string;
  password: string;
  databaseType?:
  | 'mssql'
  | 'postgres'
  | 'mysql'
  | 'mariadb'
  | 'oracle'
  | 'sqlite';
  schemaName?: string;
  ssl?: boolean;
  skipTables?: string[];
}

export interface IGenerationOptions {
  resultsPath: string;
  pluralizeNames: boolean;
  noConfigs: boolean;
  convertCaseFile: 'pascal' | 'param' | 'camel' | 'none';
  convertCaseEntity: 'pascal' | 'camel' | 'none';
  convertCaseProperty: 'pascal' | 'camel' | 'none';
  convertEol: 'LF' | 'CRLF';
  propertyVisibility: 'public' | 'protected' | 'private' | 'none';
  lazy: boolean;
  activeRecord: boolean;
  generateConstructor: boolean;
  customNamingStrategyPath: string;
  relationIds: boolean;
  strictMode: 'none' | '?' | '!';
  skipSchema: boolean;
  indexFile: boolean;
  exportType: 'named' | 'default';
}

export interface TemplateContext {
  tableName: string;
  comments: string;
  pk: string;
  className: string;
  classname: string;
  pathName: string;
  package: string;
  author: string;
  email: string;
  datetime: string;
  moduleName: string;
  secondModuleName: string;
  serverName: string;
  customPackageName: string;
  columns: any[];
}

export interface TemplateColumn {
  columnName: string;
  dataType: string;
  comments: string;
  attrName: string;
  attrname: string;
  attrType: string;
  extra: string; // TODO:
}

export interface GeneratorConfig {
  templateFolder: string;
  driverName: 'mssql' | 'postgres' | 'mysql' | 'mariadb' | 'oracle' | 'sqlite';
  dbOptions: IConnectionOptions;
  javaOptions: JavaConfig;
}

export interface JavaConfig {
  package: string;
  author: string;
  email: string;
  tablePrefix: string;
  mainModule: string;
  serverName: string;
}

export class SchemaGenerator {
  constructor(public options: GeneratorConfig) {
    this.loadTemplates();
  }

  private typesMapping: { [key: string]: string } = {
    tinyint: 'Integer',
    smallint: 'Integer',
    mediumint: 'Integer',
    int: 'Integer',
    integer: 'Integer',
    bigint: 'Long',
    float: 'Float',
    double: 'Double',
    decimal: 'BigDecimal',
    bit: 'Boolean',
    char: 'String',
    varchar: 'String',
    tinytext: 'String',
    text: 'String',
    mediumtext: 'String',
    longtext: 'String',
    longblob: 'byte[]',
    date: 'Date',
    datetime: 'Date',
    timestamp: 'Date',
  };

  private templates = new Map<string, string>();
  private get cwd() {
    return process.cwd();
  }

  private loadTemplates() {
    const filesFolder = resolve(this.cwd, this.options.templateFolder);
    readdirSync(filesFolder).forEach(file => {
      if (file.includes('.vm')) {
        const template = readFileSync(resolve(filesFolder, file)).toString();
        this.templates.set(file, template);
      }
    });
  }

  private async loadDataSchema() {
    const driver = await Engine.createDriver(this.options.driverName);
    const { dbOptions } = this.options;
    const connectionOption = Object.assign({}, dbOptions, {
      databaseType: this.options.driverName,
      schemaName: '',
      ssl: false,
      skipTables: [],
    });

    const collection = await Engine.dataCollectionPhase(
      driver,
      connectionOption,
      null,
    );

    await Engine.createModelFromDatabase(driver, connectionOption, {
      resultsPath:'orm',
      pluralizeNames:true,
      noConfigs:false,
      convertCaseFile:'pascal',
      convertCaseEntity:'pascal',
      convertCaseProperty:'pascal',
      convertEol:'LF',
      propertyVisibility:'public',
      lazy:false,
      activeRecord:true,
      generateConstructor:false,
      customNamingStrategyPath:'',
      relationIds:true,
      strictMode:'none',
      skipSchema:false,
      indexFile:false,
      exportType:'named'
    });

    // collection
    return collection;
  }

  private save(filePath: string, content: string, force = false) {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    if (force || !existsSync(filePath)) {
      writeFileSync(filePath, content);
    }
  }

  public getFileName(
    template: string,
    className: string,
    packageName: string,
    moduleName: string,
  ) {
    let packagePath = 'main/java/';
    const customPackageName = className.toLowerCase();

    return '';
  }

  public createTemplateContext(entity: Entity): TemplateContext {
    const {
      mainModule: moduleName,
      package: packageName,
      author,
      email,
      serverName,
    } = this.options.javaOptions;

    const datetime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const tableName = entity.sqlName;
    const classname = lodash.camelCase(
      tableName.replace(this.options.javaOptions.tablePrefix, ''),
    );
    const customPackageName = lodash.upperFirst(classname);
    const pk = entity.columns.find(column => column.primary).tscName;
    const columns = entity.columns.map(column => {
      const type = column.type.toString();
      const attrname = lodash.camelCase(column.options.name);
      return {
        columnName: column.options.name,
        dataType: column.type,
        comments: column.options.comment.replace(/\n/g, ''),
        attrName: lodash.upperFirst(attrname),
        attrname,
        attrType: this.typesMapping[type],
      };
    });
    const context = {
      tableName,
      comments: '',
      pk,
      className: lodash.upperFirst(classname),
      classname,
      pathName: lodash.lowerCase(classname),
      package: packageName,
      author,
      email,
      datetime,
      moduleName,
      secondModuleName: classname,
      serverName,
      customPackageName,
      columns,
    };
    return context;
  }

  public async generate() {
    const schemas = await this.loadDataSchema();




    console.log('schemas', schemas)
    // schemas.forEach(schema => {
    //   const context = this.createTemplateContext(schema);
    //   this.templates.forEach((template, key) => {
    //     const className = lodash.upperFirst(lodash.camelCase(schema.sqlName));
    //     const saveToPath = this.getFileName(
    //       key,
    //       className,
    //       this.options.javaOptions.package,
    //       this.options.javaOptions.mainModule,
    //     );
    //     if (saveToPath) {
    //       const content = Velocity.render(template, context);
    //       const filePath = resolve(this.cwd, 'output', saveToPath);
    //       this.save(filePath, content, true);
    //     }
    //   });
    // });
  }
}

const generator = new SchemaGenerator({
  templateFolder: 'src/templates/java',
  driverName: 'mysql',
  dbOptions: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    databaseName: 'kgdb',
    password: 'Viking$123',
  },
  javaOptions: {
    package: 'com.dataexa.maya',
    email: 'xieyunqi@dataexa.com',
    author: 'viking',
    tablePrefix: 'knwl_',
    mainModule: 'example',
    serverName: 'maya.system.serviceId',
  },
});

generator.generate();

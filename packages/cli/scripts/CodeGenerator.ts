import { writeFileSync, readFileSync, readdirSync, existsSync } from "fs";
import * as handlebars from "handlebars";
import { resolve } from "path";
import ts = require("typescript");
import * as lodash from "lodash";

type TemplateType = "controller" | "dto" | "service" | "schema";
type DomainType = {
  name: string;
  module?: string;
  fields: {
    name: string;
    type: string;
    baseType: string;
    dbType: string;
    comment: string;
    nullable: boolean;
    length?: number;
    default?: string;
  }[];
};

export class CodeGenerator {
  private readonly templates = {
    dto: "",
    controller: "",
    service: "",
    schema: "",
  };

  private readonly domains: DomainType[] = [];

  constructor(public sourcePath = "src") {
    if (sourcePath === "src") {
      this.sourcePath = resolve(process.cwd(), "src", this.sourcePath);
    }

    this.templates = {
      dto: this.load("dto"),
      controller: this.load("controller"),
      service: this.load("service"),
      schema: this.load("schema"),
    };
  }

  private save(filePath: string, content: string, force = false) {
    if (force || !existsSync(filePath)) {
      writeFileSync(filePath, content);
    }
  }

  private load(name: TemplateType) {
    const cwd = process.cwd();
    return readFileSync(
      resolve(cwd, `templates/node/${name}.template.md`)
    ).toString();
  }

  private generateItem(domain: DomainType, type: TemplateType) {
    const { name, fields, module: moduleName } = domain;
    const capitalName = lodash.upperFirst(name);
    const lowerName = lodash.lowerFirst(name);
    const kebabName = lodash.kebabCase(name);

    const compiledTemplate = handlebars.compile(this.templates[type]);

    const content = compiledTemplate({
      Domain: capitalName,
      domain: lowerName,
      ControllerPath: moduleName + "/" + kebabName,
      fields,
    }).replace("``` typescript", "");

    const fileSuffix = lodash.upperFirst(type);
    const folderName = {
      dto: "dto",
      controller: "controllers",
      service: "services",
      schema: "schemas",
    }[type];

    const filePath = resolve(
      this.sourcePath,
      `${folderName}/${capitalName}${fileSuffix}.ts`
    );

    this.save(filePath, content);
  }

  public parseInterfaces(module = "") {
    const interfacePath = resolve(this.sourcePath, "interfaces", module);
    console.log("interfacePath:", interfacePath);
    readdirSync(interfacePath).forEach((file) => {
      if (!file.includes("index.ts") && file.includes(".ts")) {
        const filePath = resolve(interfacePath, file);
        const node = ts.createSourceFile(
          file,
          readFileSync(filePath, "utf8"),
          ts.ScriptTarget.Latest
        );
        const domain = node.fileName.substring(1).replace(".ts", "");
        const fields = [];
        const declaredInterface = node["statements"].find((item) => {
          return item.kind === ts.SyntaxKind.InterfaceDeclaration;
        });

        if (declaredInterface && declaredInterface["members"]) {
          declaredInterface["members"].forEach((item) => {
            const name = item.name.escapedText;
            let type = item.type.typeName
              ? item.type.typeName.escapedText
              : ts.SyntaxKind[item.type.kind].replace("Keyword", "");

            let baseType = item.type.typeName
              ? item.type.typeName.escapedText
              : lodash.lowerCase(type);

            if (type.includes("Array") && item.type.elementType.typeName) {
              const arrayTypeName = item.type.elementType.typeName.escapedText;
              type = baseType = `[${arrayTypeName}]`;
            } else if (type.includes("TypeLiteral")) {
              type = "{[key:string]:any}"; // TODO 尽量不要定义这种
              baseType = "Object";
            }

            fields.push({ name, type, baseType });
          });
        }

        this.domains.push({
          name: domain,
          module,
          fields,
        });
      } else if (!file.includes(".")) {
        this.parseInterfaces(file);
        this.autoGenerateIndexTs(["interfaces/" + file]);
      }
    });
  }

  public getTypesFromFolder(folder: string) {
    const filesFolder = resolve(this.sourcePath, folder);
    const types = [];
    readdirSync(filesFolder).forEach((file) => {
      if (file !== "index.ts" && file.includes(".ts")) {
        types.push(file.replace(".ts", ""));
      }
    });
    return types;
  }

  public generateRegisterDomain() {
    const controllers = this.getTypesFromFolder("controllers").join(",\n  ");
    const services = this.getTypesFromFolder("services").join(",\n  ");
    const schemaTypes = this.getTypesFromFolder("schemas");
    const schemas = schemaTypes.join(",\n  ");
    const models = schemaTypes
      .map((item) => {
        const capitalName = item.replace("Schema", "");
        return `{ name: '${capitalName}', schema: ${capitalName}Schema }`;
      })
      .join(",\n");

    const content = `import {\n  ${controllers}\n} from './controllers';\n
import {\n  ${services}\n} from './services';\n
import {\n  ${schemas}\n} from './schemas';\n

export const controllers = [${controllers}];\n
export const services = [${services}];\n
export const models = [
  ${models}
];
    `;
    const registryPath = resolve(this.sourcePath, "registry.ts");
    this.save(registryPath, content, true);
  }

  public generate() {
    this.parseInterfaces();
    this.domains.forEach((domain) => {
      this.generateItem(domain, "dto");
      this.generateItem(domain, "service");
      this.generateItem(
        {
          name: domain.name,
          fields: domain.fields.filter((field) => {
            return field.name !== "id";
          }),
        },
        "schema"
      );
      this.generateItem(domain, "controller");
    });

    this.autoGenerateIndexTs(["controllers"]);
    this.autoGenerateIndexTs(["dto"]);
    this.autoGenerateIndexTs(["schemas"]);
    this.autoGenerateIndexTs(["services"]);
    this.autoGenerateIndexTs(["interfaces"]);
    this.generateRegisterDomain();
    console.log("files generated!");
  }

  public autoGenerateIndexTs(folders: string[], extra = "") {
    folders.forEach((folder) => {
      const folderPath = resolve(this.sourcePath, folder);
      const files = [];
      readdirSync(folderPath).forEach((file) => {
        if (file.includes(".ts") && !file.includes("index.ts")) {
          const fileName = file.replace(".ts", "");
          files.push(`export * from './${fileName}';`);
        } else if (!file.includes(".")) {
          files.push(`export * from './${file}';`);
        }
      });

      if (extra) {
        files.push(extra);
      }
      this.save(folderPath + "/index.ts", files.join("\n"), true);
    });
  }
}

const generator = new CodeGenerator("../server/src");
generator.generate();

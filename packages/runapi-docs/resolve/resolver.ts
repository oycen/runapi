import ts from "typescript";
import path from "path";
import fs from "fs";
import { ProjectModel } from "../model/project-model";
import { ServiceModel } from "../model/service-model";
import { ApiModel } from "../model/api-model";

export type Project = Omit<ProjectModel, "services">;

export interface ProjectConfig {
  entry: string;
  output: string;
  projectName: string;
  projectDescription: string;
}

export class ServiceProgramResolver {
  readonly config: ProjectConfig;

  constructor(config: ProjectConfig) {
    this.config = config;
  }

  resolve() {
    const model: ProjectModel = {
      name: this.config.projectName,
      description: this.config.projectDescription,
      services: []
    };
    const program = this.createProgram(this.config.entry);
    const sourceFiles = this.getSourceFiles(program);
    model.services = this.getServiceModels(sourceFiles);

    this.writeFile(this.config.output, JSON.stringify(model, null, 2));
    return model;
  }

  writeFile(path: string, data: string) {
    fs.writeFile(path, data, () => {
      console.log("Write done.");
    });
  }

  createProgram(entry: string) {
    return ts.createProgram([entry], {});
  }

  getSourceFiles(program: ts.Program) {
    return program.getSourceFiles() as ts.SourceFile[];
  }

  getServiceFiles(sourceFiles: ts.SourceFile[], suffix: string) {
    return sourceFiles.filter(sourceFile => sourceFile.fileName.endsWith(suffix));
  }

  getServiceModels(sourceFiles: ts.SourceFile[]): ServiceModel[] {
    const serviceModels: ServiceModel[] = [];
    const serviceFiles = this.getServiceFiles(sourceFiles, ".service.ts");

    serviceFiles.forEach(serviceFile => {
      const serviceSyntaxList = this.getServiceSyntaxList(serviceFile);
      const serviceClassDeclaration = this.getServiceClassDeclaration(serviceSyntaxList);
      const serviceImportDeclarations = this.getServiceImportDeclarations(serviceFile, serviceSyntaxList, sourceFiles);

      if (!serviceClassDeclaration) return;

      const jsDoc = this.getServiceClassOrMethodJSDoc(serviceClassDeclaration);
      if (!jsDoc) return;

      const { summary, description } = this.getServiceClassOrMethodJSDocTagComment(jsDoc);

      const filename = this.getServiceFilename(serviceFile);
      const filepath = this.getServiceFilepath(serviceFile);
      const name = this.getServiceClassName(serviceClassDeclaration);

      const serviceClassDeclarationMembers = this.getServiceClassDeclarationMembers(serviceClassDeclaration);
      const serviceMethodDeclarations = this.getServiceMethodDeclarations(serviceClassDeclarationMembers);
      const apis = this.getServiceApiModels(serviceMethodDeclarations, serviceImportDeclarations);

      serviceModels.push({
        filename,
        filepath,
        name: name ?? null,
        summary: summary ?? null,
        description: description ?? null,
        apis
      });
    });
    return serviceModels;
  }

  getServiceApiModels(methodDeclarations: ts.ClassElement[], serviceImportDeclarations: any[]) {
    const apiModels: ApiModel[] = [];
    methodDeclarations.forEach(methodDeclaration => {
      const jsDoc = this.getServiceClassOrMethodJSDoc(methodDeclaration);
      if (!jsDoc) return;

      const name = this.getServiceMethodName(methodDeclaration);
      const { summary, description } = this.getServiceClassOrMethodJSDocTagComment(jsDoc);

      const decorators = this.getServiceMethodDecorators(methodDeclaration);
      if (!decorators) return;

      this.getServiceMethodReturnType(methodDeclaration, serviceImportDeclarations);

      const {
        requestDecorator: {
          method,
          args: [path]
        }
      } = decorators;

      apiModels.push({
        name,
        summary: summary ?? null,
        description: description ?? null,
        method,
        path,
        headers: "",
        params: "",
        query: "",
        body: "",
        response: ""
      });
    });
    return apiModels;
  }

  getServiceFilename(sourceFile: ts.SourceFile) {
    return sourceFile.fileName.substring(sourceFile.fileName.lastIndexOf("/") + 1);
  }

  getServiceFilepath(sourceFile: ts.SourceFile) {
    return sourceFile.fileName;
  }

  getServiceSyntaxList(sourceFile: ts.SourceFile) {
    const syntax = sourceFile.getChildren().find(node => node.kind === ts.SyntaxKind.SyntaxList);
    return syntax?.getChildren() ?? [];
  }

  getServiceClassDeclaration(syntaxList: ts.Node[]): ts.ClassDeclaration | undefined {
    const [classDeclaration] = syntaxList.filter(node => node.kind === ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration[];
    return classDeclaration;
  }

  getServiceImportDeclarations(serviceFile: ts.SourceFile, syntaxList: ts.Node[], sourceFiles: ts.SourceFile[]) {
    const importDeclarations = syntaxList.filter(node => node.kind === ts.SyntaxKind.ImportDeclaration) as ts.ImportDeclaration[];
    return importDeclarations
      .map((importDeclaration: any) => {
        const s = sourceFiles.filter(item => item.fileName.includes(importDeclaration.moduleSpecifier.text));
        return importDeclaration.importClause?.namedBindings.elements.map((element: any) => {
          const path = (serviceFile as any).resolvedModules.get(importDeclaration.moduleSpecifier.text).resolvedFileName;
          const importFile = sourceFiles.find(sourceFile => sourceFile.fileName === path);
          return {
            name: element.name.escapedText,
            path,
            syntaxList: importFile ? this.getServiceSyntaxList(importFile) : null
          };
        });
      })
      .flat();
  }

  getServiceClassName(classDeclaration: ts.ClassDeclaration) {
    return classDeclaration.name?.escapedText.toString();
  }

  getServiceClassDeclarationMembers(classDeclaration: ts.ClassDeclaration) {
    return classDeclaration.members;
  }

  getServiceClassOrMethodJSDoc(methodDeclaration: ts.ClassDeclaration | ts.ClassElement): ts.JSDoc | undefined {
    return (methodDeclaration as any)?.jsDoc[0];
  }

  getServiceClassOrMethodJSDocTagComment({ comment, tags }: ts.JSDoc) {
    return {
      summary: comment?.toString() ?? tags?.find(tag => tag.tagName.escapedText === "summary")?.comment?.toString(),
      description: tags?.find(tag => tag.tagName.escapedText === "description")?.comment?.toString()
    };
  }

  getServiceMethodDeclarations(classDeclarationMembers: ts.NodeArray<ts.ClassElement>) {
    return classDeclarationMembers.filter(node => node.kind === ts.SyntaxKind.MethodDeclaration);
  }

  getServiceMethodName(methodDeclaration: ts.ClassElement) {
    return (methodDeclaration.name as ts.Identifier).escapedText.toString();
  }

  getServiceMethodDecoratorName(decorator: ts.Decorator) {
    return (decorator as any).expression.expression.escapedText;
  }

  getServiceMethodDecoratorArgs(decorator: ts.Decorator) {
    return (decorator as any).expression.arguments.map((arg: any) => arg.text);
  }

  getServiceMethodDecorators(methodDeclaration: ts.ClassElement) {
    const decorators = methodDeclaration.decorators;
    if (!decorators) return;
    return {
      requestDecorator: { method: this.getServiceMethodDecoratorName(decorators[0]), args: this.getServiceMethodDecoratorArgs(decorators[0]) }
    };
  }

  getServiceMethodReturnType(methodDeclaration: ts.ClassElement, serviceImportDeclarations: any[]) {
    const returnType = (methodDeclaration as any).type;
    const returnTypeName = returnType.typeName.escapedText.toString();
    const returnTypeArguments = returnType.typeArguments ?? [];
    const returnTypeModule = serviceImportDeclarations.find(item => item.name === returnTypeName);
    console.log(returnTypeModule.syntaxList.map((item: any) => console.log(item)));
    return {};
  }
}

const serviceProgramResolver = new ServiceProgramResolver({
  entry: path.resolve(__dirname, "../test-file/src/index.ts"),
  output: path.resolve(__dirname, "./mode.json"),
  projectName: "Api",
  projectDescription: "Api Docs"
});

serviceProgramResolver.resolve();

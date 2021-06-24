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
    const serviceFiles = this.getServiceFiles(sourceFiles, ".service.ts");
    model.services = this.getServiceModels(serviceFiles);

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

  getServiceModels(serviceFiles: ts.SourceFile[]): ServiceModel[] {
    return serviceFiles.map(serviceFile => {
      const serviceSyntaxList = this.getServiceSyntaxList(serviceFile);
      const serviceClassDeclaration = this.getServiceClassDeclaration(serviceSyntaxList);

      const filename = this.getServiceFilename(serviceFile);
      const filepath = this.getServiceFilepath(serviceFile);
      const name = this.getServiceClassName(serviceClassDeclaration);

      const serviceClassDeclarationMembers = this.getServiceClassDeclarationMembers(serviceClassDeclaration);
      const serviceMethodDeclarations = this.getServiceMethodDeclarations(serviceClassDeclarationMembers);
      const apis = this.getServiceApiModels(serviceMethodDeclarations);
      return {
        filename,
        filepath,
        name,
        summary: "",
        description: "",
        apis
      };
    });
  }

  getServiceApiModels(methodDeclarations: ts.ClassElement[]): ApiModel[] {
    return methodDeclarations.map(methodDeclaration => {
      const jsDoc = this.getServiceMethodJSDoc(methodDeclaration);

      const name = this.getServiceMethodName(methodDeclaration);
      const { summary, description } = this.getServiceMethodJSDocTagComment(jsDoc);

      const {
        requestDecorator: {
          method,
          args: [path]
        }
      } = this.getServiceMethodDecorators(methodDeclaration);

      return {
        name,
        summary,
        description,
        method,
        path,
        headers: "",
        params: "",
        query: "",
        body: "",
        response: ""
      };
    });
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

  getServiceClassDeclaration(syntaxList: ts.Node[]) {
    const [classDeclaration] = syntaxList.filter(node => node.kind === ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration[];
    return classDeclaration;
  }

  getServiceClassName(classDeclaration: ts.ClassDeclaration) {
    return classDeclaration.name.escapedText.toString();
  }

  getServiceClassDeclarationMembers(classDeclaration: ts.ClassDeclaration) {
    return classDeclaration.members;
  }

  getServiceMethodDeclarations(classDeclarationMembers: ts.NodeArray<ts.ClassElement>) {
    return classDeclarationMembers.filter(node => node.kind === ts.SyntaxKind.MethodDeclaration);
  }

  getServiceMethodName(methodDeclaration: ts.ClassElement) {
    return (methodDeclaration.name as ts.Identifier).escapedText.toString();
  }

  getServiceMethodJSDoc(methodDeclaration: ts.ClassElement): ts.JSDoc {
    return (methodDeclaration as any).jsDoc[0];
  }

  getServiceMethodJSDocTagComment({ comment, tags }: ts.JSDoc) {
    return {
      summary: comment.toString() ?? tags.find((tag: any) => tag.tagName.escapedText === "summary")?.comment.toString(),
      description: tags.find((tag: any) => tag.tagName.escapedText === "description")?.comment.toString()
    };
  }

  getServiceMethodDecoratorName(decorator: ts.Decorator) {
    return (decorator as any).expression.expression.escapedText;
  }

  getServiceMethodDecoratorArgs(decorator: ts.Decorator) {
    return (decorator as any).expression.arguments.map((arg: any) => arg.text);
  }

  getServiceMethodDecorators(methodDeclaration: ts.ClassElement) {
    const decorators = methodDeclaration.decorators;
    return {
      requestDecorator: { method: this.getServiceMethodDecoratorName(decorators[0]), args: this.getServiceMethodDecoratorArgs(decorators[0]) }
    };
  }
}

const serviceProgramResolver = new ServiceProgramResolver({
  entry: path.resolve(__dirname, "../test-file/src/index.ts"),
  output: path.resolve(__dirname, "./mode.json"),
  projectName: "Api",
  projectDescription: "Api Docs"
});

serviceProgramResolver.resolve();

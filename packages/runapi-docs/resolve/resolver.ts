import ts from "typescript";
import path from "path";
import { ProjectModel } from "../model/project-model";
import { ServiceModel } from "../model/service-model";

export type Project = Omit<ProjectModel, "services">;

export interface ProjectConfig {
  entry: string;
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
    return model;
  }

  createProgram(entry: string) {
    return ts.createProgram([path.resolve(__dirname, entry)], {});
  }

  getSourceFiles(program: ts.Program) {
    return program.getSourceFiles() as ts.SourceFile[];
  }

  getServiceFiles(sourceFiles: ts.SourceFile[], suffix: string) {
    return sourceFiles.filter(sourceFile => sourceFile.fileName.endsWith(suffix));
  }

  getServiceModels(serviceFiles: ts.SourceFile[]): ServiceModel[] {
    return serviceFiles.map(serviceFile => {
      const filename = this.getServiceFilename(serviceFile);
      const filepath = serviceFile.fileName;
      const serviceSyntaxList = this.getServiceSyntaxList(serviceFile);
      const serviceClassDeclaration = this.getServiceClassDeclaration(serviceSyntaxList);
      const name = this.getServiceName(serviceClassDeclaration);
      return {
        filename,
        filepath,
        name,
        summary: "",
        description: "",
        apis: []
      };
    });
  }

  getServiceFilename(sourceFile: ts.SourceFile) {
    return sourceFile.fileName.substring(sourceFile.fileName.lastIndexOf("/") + 1);
  }

  getServiceName(classDeclaration: ts.ClassDeclaration) {
    return classDeclaration.name.escapedText.toString();
  }

  getServiceSyntaxList(sourceFile: ts.SourceFile) {
    const syntax = sourceFile.getChildren().find(node => node.kind === ts.SyntaxKind.SyntaxList);
    return syntax?.getChildren() ?? [];
  }

  getServiceClassDeclaration(syntaxList: ts.Node[]) {
    const [classDeclaration] = syntaxList.filter(node => node.kind === ts.SyntaxKind.ClassDeclaration) as ts.ClassDeclaration[];
    return classDeclaration;
  }
}

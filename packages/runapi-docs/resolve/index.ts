import ts, { SyntaxKind } from "typescript";
import path from "path";
import { ProjectModel } from "../model/project-model";
import { ApiModel } from "../model/api-model";

export const resolve = async () => {
  const project: ProjectModel = {
    name: "Api",
    description: "Api Docs",
    services: []
  };
  const program = ts.createProgram([path.resolve(__dirname, "../test-file/src/index.ts")], {});
  const sourceFiles = program.getSourceFiles();
  const serviceFiles = sourceFiles.filter(sourceFile => sourceFile.fileName.endsWith(".service.ts"));
  project.services = serviceFiles.map(serviceFile => {
    const syntaxList = serviceFile.getChildren();
    const syntax = syntaxList.find(node => node.kind === SyntaxKind.SyntaxList);
    const nodes = syntax?.getChildren() ?? [];
    const [importDeclarations, classDeclarations] = [
      nodes.filter(node => node.kind === SyntaxKind.ImportDeclaration),
      nodes.filter(node => node.kind === SyntaxKind.ClassDeclaration)
    ];
    const [classDeclaration] = classDeclarations;
    const classDeclarationMembers = (classDeclaration as any).members as ts.Node[];
    const [methodDeclarations] = [classDeclarationMembers.filter(node => node.kind === SyntaxKind.MethodDeclaration)];
    const apis: ApiModel[] = methodDeclarations.map(node => {
      const decorators = node.decorators as any;
      const method = (decorators[0] as any).expression.expression.escapedText;
      const path = decorators[0].expression.arguments[0].text;
      const jsDoc = (node as any).jsDoc[0];
      const tags = jsDoc.tags ?? [];
      const [summary, description] = [
        tags.find((tag: any) => tag.tagName.escapedText === "summary")?.comment,
        tags.find((tag: any) => tag.tagName.escapedText === "description")?.comment
      ];
      const comment = jsDoc.comment;
      const name = (node as any).name.escapedText;
      // console.log("===============================");
      // console.log(path);
      return {
        name,
        summary: summary ?? comment,
        description,
        method: method ? (method.toLocaleUpperCase() as any) : undefined,
        path,
        headers: "",
        params: "",
        query: "",
        body: "",
        response: ""
      };
    });
    console.log("===============================");
    console.log(apis);
    return {
      filename: serviceFile.fileName.substring(serviceFile.fileName.lastIndexOf("/") + 1),
      filepath: serviceFile.fileName,
      name: (classDeclaration as any).name.escapedText,
      summary: "",
      description: "",
      apis
    };
  });
  // console.log(project);
};

resolve();

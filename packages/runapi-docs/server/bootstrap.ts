import Fastify, { FastifyInstance } from "fastify";
import path from "path";
import fs from "fs";
import { ProjectModel } from "../model/project-model";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

const server: FastifyInstance = Fastify({});

server.get("/", async () => {
  let project: ProjectModel;
  const dir = path.resolve(__dirname, "../test-file/src/training-server/course.service.ts");
  const sourceFile = parse(fs.readFileSync(dir).toString(), {
    sourceType: "module",
    plugins: ["typescript", "decorators-legacy"]
  });
  project = {
    name: "Api",
    description: "Api Docs",
    services: []
  };
  const data = traverse(sourceFile, {
    enter(path) {
      if (path.node.type === "ClassDeclaration") {
        project.services.push({
          filename: "",
          filepath: dir,
          name: path.node.id.name,
          caption: "",
          description: "",
          apis: path.node.body.body.map(node => {
            if (node.type === "ClassMethod") {
              return {
                name: (node.key as any).name,
                caption: (node?.leadingComments ?? []).map(item => item?.value ?? "").join(",") ?? "",
                description: (node?.leadingComments ?? []).map(item => item?.value ?? "").join(",") ?? "",
                method: (node.decorators?.[0] ? (node.decorators?.[0].expression as any)?.callee?.name ?? "" : "").toLocaleUpperCase(),
                path: node.decorators?.[0] ? (node.decorators?.[0].expression as any)?.arguments?.[0]?.value ?? "" : "",
                headers: {},
                params: {},
                query: {},
                body: {},
                response: {}
                // node,
              };
            } else {
              return {
                name: "",
                caption: "",
                description: "",
                method: "GET",
                path: "",
                headers: {},
                params: {},
                query: {},
                body: {},
                response: {}
                // node,
              };
            }
          })
        });
      }
    }
  });
  return project;
});

const bootstrap = async () => {
  try {
    await server.listen(3000);

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
bootstrap();

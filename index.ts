import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";
import { AppModule } from "./src/app.module";
import { onRequest } from "firebase-functions/v2/https";
import { log } from "firebase-functions/logger";
import bootstrap from "./src/custom-main";

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  await (await bootstrap(app)).init();
};

export const api = onRequest(
  {
    timeoutSeconds: 120,
    memory: "256MiB",
    region: ["asia-southeast1"]
  },
  async (request, response) => {
    process.env.TZ = "Asia/Bangkok";
    try {
      log("timeCheck", Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch (error) {
      console.log("error", error);
    }
    createFunction(expressServer);
    expressServer(request, response);
  });
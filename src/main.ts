import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import customBootstrap from "./custom-main";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await (await customBootstrap(app)).listen(process.env.PORT_START);
}

bootstrap();

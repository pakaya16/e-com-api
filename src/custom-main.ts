import { AppModule } from "./app.module";
import { authSwagger } from "./swagger/swagger-auth";
import * as packageJson from "../package.json";
import { swaggerConfigs } from "./swagger/configs";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { noCacheMiddleware } from "./middleware/no-cache.middleware";
import { ValidationPipe } from "@nestjs/common";
import { UserJwtGuard } from "./guards/user-jwt.guard";
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { useContainer } from 'class-validator';

async function bootstrap(app) {
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use("/api-docs", (req, res, next) => {
    authSwagger({
      httpAdapter, res, next, req
    });
  });

  app.useGlobalInterceptors(
    new ResponseInterceptor()
  );

  const config = new DocumentBuilder()
    .setTitle("ตลาดไท")
    .setDescription("### ตลาดไท API Documentation")
    .setVersion(packageJson?.version)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'seller-jwt')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'user-jwt')
    .addGlobalParameters({
      name: "X-Api-Version",
      in: "header",
      description: "app check token",
      required: true,
      schema: {
        type: "string",
        default: "1.0"
      }
    })
    .addGlobalParameters({
      name: "X-Local",
      in: "header",
      description: "language",
      required: true,
      schema: {
        type: "string",
        default: "th"
      }
    })
    .build();

  app.setGlobalPrefix("api");
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, swaggerConfigs);

  const jwtGuard = app.get(UserJwtGuard);
  app.useGlobalGuards(jwtGuard);
  app.use(noCacheMiddleware);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  return app
}

export default bootstrap
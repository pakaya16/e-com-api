import * as packageJson from '../../package.json';
export const swaggerConfigs = {
  customfavIcon: '/static/logo.png',
  customSiteTitle: 'ตลาดไท Online V.' + packageJson?.version,
  customCssUrl: '/static/swagger-custom.css',
  customJs: '/static/swagger-custom.js',
  swaggerOptions: {
    persistAuthorization: true,
    defaultModelsExpandDepth: -1
  }
}
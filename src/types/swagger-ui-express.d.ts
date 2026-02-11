declare module 'swagger-ui-express' {
  import { Router } from 'express';
  
  function serve(req: any, res: any, next: any): void;
  function setup(swaggerSpec: any, options?: any): Router;
  
  export { serve, setup };
}

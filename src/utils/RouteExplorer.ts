import { Router } from 'express';
import expressListRoutes from 'express-list-routes';

interface RouteExplorerProps {
  router: Router;
  prefix: string;
}

class RouteExplorer {
  static printRoutes(routeExplorers: RouteExplorerProps[]) {
    routeExplorers.forEach(({ router, prefix }) => {
      expressListRoutes(router, { prefix });
    });
  }
}

export default RouteExplorer;

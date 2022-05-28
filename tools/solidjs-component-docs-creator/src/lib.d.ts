type RouteModel = {
  name: string;
  path: string;
  page: string;
};

type RouteRootModel = {
  name: string;
  path: string;
  children: RouteModel[];
};

type ConfigModel = {
  name: string;
  port: number;
  routes: RouteRootModel[];
};

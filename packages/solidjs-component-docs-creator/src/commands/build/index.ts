import Webpack from 'webpack';
import getWebpackConfig from '../../utils/webpack-config';
import { generateCodeFiles } from '../../utils/code-generator';

type ServeOptions = {
  routes: RouteRootModel[];
};

async function build({ routes }: ServeOptions): Promise<any> {
  generateCodeFiles();
  const rewrites = routes.map(route => new RegExp(route.path));
  const webpackConfig = getWebpackConfig({ mode: 'production', rewrites });
  const compiler = Webpack(webpackConfig);

  compiler.run((error, stats) => {
    if (error) {
      console.log(error.message);
      return;
    }
    if (stats?.hasErrors()) {
      console.log(stats.toString());
    }
  });
}

export default build;

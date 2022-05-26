import Webpack from 'webpack';
import getWebpackConfig from '../../utils/webpack.config.js';
import { generateCodeFiles } from '../../utils/code-generator.js';

type RouteOption = {
  name: string;
  path: string;
  page: string;
  children: RouteOption[];
};

type ServeOptions = {
  routes: RouteOption[];
};

async function build({ routes }: ServeOptions) {
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
      return;
    }
    console.log('complete');
  });
}

export default build;

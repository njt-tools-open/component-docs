import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfig from '../../utils/webpack.config.js';
import { generateCodeFiles } from '../../utils/code-generator.js';

type RouteOption = {
  name: string;
  path: string;
  page: string;
  children: RouteOption[];
};

type ServeOptions = {
  port: number;
  routes: RouteOption[];
};

async function serve({ port, routes }: ServeOptions) {
  generateCodeFiles();
  const rewrites = routes.map(route => new RegExp(route.path));
  const webpackConfig = getWebpackConfig({
    mode: 'development',
    port,
    rewrites,
  });
  const compiler = Webpack(webpackConfig);
  const devServerOptions = { ...webpackConfig.devServer, open: true };
  const server = new WebpackDevServer(devServerOptions, compiler);

  try {
    console.log('[DOCS]', 'Starting server...');
    const res = await server.start();
    console.log(res);
  } catch (error) {
    console.error('[DOCS]', error);
  }
}

export default serve;

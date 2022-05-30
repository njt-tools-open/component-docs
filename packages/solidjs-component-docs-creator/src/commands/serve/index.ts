import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getWebpackConfig from '../../utils/webpack-config';
import { generateCodeFiles } from '../../utils/code-generator';

type ServeOptions = {
  port: number;
  routes: RouteRootModel[];
};

async function serve({ port, routes }: ServeOptions): Promise<any> {
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
    await server.start();
  } catch (error) {
    console.error('[DOCS]', error);
  }
}

export default serve;

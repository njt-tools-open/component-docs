import { resolve } from 'path';
import { readFileSync, statSync } from 'fs';
import * as net from 'net';
import toml from 'toml';

const getDefaultConfig = () => {
  return {
    name: '',
    port: 3010,
    routes: [],
  };
};

/** read config file */
export const getConfig = () => {
  const config: Record<string, any> = getDefaultConfig();

  try {
    const customConfig = toml.parse(
      readFileSync(resolve('./s25c.toml'), { encoding: 'utf8' })
    );
    Object.assign(config, customConfig);
  } catch (error) {
    console.error('[DOCS]', error);
  }

  return config;
};

/** check the port is occupied */
const isPortOccupied = (port: number): Promise<false> =>
  new Promise((resolve, reject) => {
    const server = net.createServer().listen(port);

    server.on('listening', () => {
      server.close(); // 关闭服务
      resolve(false);
    });

    server.on('error', (err: any) => {
      // 端口已经被使用
      if (err.code === 'EADDRINUSE') {
        reject(
          new Error(`The port [${port}] is occupied, please change other port.`)
        );
      } else {
        reject(err);
      }
    });
  });

/** get idle port  */
export const getIdlePort = async (port: number) => {
  try {
    const isOccupied = await isPortOccupied(port);

    if (!isOccupied) return port;
  } catch (_error) {
    const usePort = await getIdlePort(port + 1);
    return usePort;
  }
};


export const isFolder = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

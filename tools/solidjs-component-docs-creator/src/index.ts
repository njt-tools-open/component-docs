#!/usr/bin/env node

import * as fs from 'fs';
import { Command } from 'commander';

import makeCommand from './commands/make';
import serveCommand from './commands/serve';
import buildCommand from './commands/build';
import { getConfig } from './utils';

const packageJson = JSON.parse(
  fs.readFileSync(require.resolve('../package.json'), 'utf8')
);

const program = new Command();

const CONFIG = getConfig();

/**
 * make project base resource
 */
program
  .command('make')
  .description('Make project base resource.')
  .action(makeCommand);

/**
 * start devepment server
 */
program
  .command('serve')
  .description('Start document serve for writing.')
  .option('--port', 'Writing server port.')
  .action(() => {
    const options = program.opts();
    const port = Number.parseInt(options.port, 10);
    serveCommand({
      port: Number.isNaN(port) ? CONFIG.port : port,
      routes: CONFIG.routes,
    });
  });

/**
 * build form production
 */
program
  .command('build')
  .description('Build to front end resources.')
  .action(() => {
    buildCommand({
      routes: CONFIG.routes,
    });
  });

program.version(packageJson.version).parse();

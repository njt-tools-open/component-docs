#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs = __importStar(require("fs"));
var commander_1 = require("commander");
var make_1 = __importDefault(require("./commands/make"));
var serve_1 = __importDefault(require("./commands/serve"));
var build_1 = __importDefault(require("./commands/build"));
var utils_1 = require("./utils");
var packageJson = JSON.parse(fs.readFileSync(require.resolve('../package.json'), 'utf8'));
var program = new commander_1.Command();
var CONFIG = (0, utils_1.getConfig)();
/**
 * make project base resource
 */
program
    .command('make')
    .description('Make project base resource.')
    .action(make_1["default"]);
/**
 * start devepment server
 */
program
    .command('serve')
    .description('Start document serve for writing.')
    .option('--port', 'Writing server port.')
    .action(function () {
    var options = program.opts();
    var port = Number.parseInt(options.port, 10);
    (0, serve_1["default"])({
        port: Number.isNaN(port) ? CONFIG.port : port,
        routes: CONFIG.routes
    });
});
/**
 * build form production
 */
program
    .command('build')
    .description('Build to front end resources.')
    .action(function () {
    (0, build_1["default"])({
        routes: CONFIG.routes
    });
});
program.version(packageJson.version).parse();

import { statSync, mkdirSync, writeFileSync } from 'fs';

export const generateModuleName = (index: any) => {
  return `Example${index}`;
};

export const isFolder = (name: string) => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export const mkdir = (name: string) => {
  mkdirSync(name);
};

export const writeCacheFile = (name: string, content: string) => {
  writeFileSync(name, content, { encoding: 'utf8' });
};

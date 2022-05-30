import { statSync, mkdirSync, writeFileSync } from 'fs';

export const generateModuleName = (index: number): string => `Example${index}`;

export const isFolder = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

export const mkdir = (name: string): void => {
  mkdirSync(name);
};

export const writeCacheFile = (name: string, content: string): void => {
  writeFileSync(name, content, { encoding: 'utf8' });
};

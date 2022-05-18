const { statSync, mkdirSync, writeFileSync } = require('fs');

exports.generateModuleName = index => {
  return `Example${index}`;
};

exports.isFolder = name => {
  try {
    const stats = statSync(name);
    return stats.isDirectory();
  } catch (_error) {
    return false;
  }
};

exports.mkdir = name => {
  mkdirSync(name);
};

exports.writeCacheFile = (name, content) => {
  writeFileSync(name, content, { encoding: 'utf8' });
};

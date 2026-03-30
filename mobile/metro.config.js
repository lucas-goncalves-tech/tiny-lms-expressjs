const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Deixa o Metro observar arquivos fora da pasta mobile/
config.watchFolders = [monorepoRoot];

// Mapeia o alias @lms/dtos para a pasta real em runtime
config.resolver.extraNodeModules = {
  '@lms/dtos': path.resolve(monorepoRoot, 'packages/dtos'),
};

module.exports = withNativeWind(config, { input: './global.css' });
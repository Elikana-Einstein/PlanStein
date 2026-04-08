module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@':        './src',
          '@modules': './src/modules',
          '@shared':  './src/shared',
        },
      }],
      'react-native-reanimated/plugin'
    ],
  };
};
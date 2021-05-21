# `craco-plugin-dump-config`

Dump your Craco, webpack, dev server, and Jest configs to a file so you can inspect them.

## Install

```shell
npm install craco-plugin-dump-config
```

## Usage

Add the following to your `craco.config.js` file.

:warning: The plugin is not enabled by default. You must turn it on when you want to use it.

```js
const { dumpConfigPlugin } = require('craco-plugin-dump-config');

module.exports = {
  // ...
  plugins: [
    // ... put it last
    {
      plugin: dumpConfigPlugin,
      options: {
        enabled: true,
      },
    },
  ],
  // ...
};
```

## Options

```
{
  enabled: boolean;
  outputDir: string | ((pluginOptions) => string);
  space: number | string;
  stringify: (config, pluginOptions) => string;
  getFilename: (name) => string;
}
```

If you provide your own `stringify`, also provide `getFilename` so you can customize the extension.

```js
const { inspect } = require('util');
const { dumpConfigPlugin } = require('craco-plugin-dump-config');

module.exports = {
  plugins: [
    {
      plugin: dumpConfigPlugin,
      options: {
        enabled: true,
        stringify: config => inspect(config, { showHidden: false, depth: null, colors: false }),
        getFilename: name => `${name}.txt`,
      },
    },
  ],
};
```

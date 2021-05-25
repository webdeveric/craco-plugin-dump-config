# `craco-plugin-inspect-config`

Inspect your Craco, webpack, dev server, and Jest configs then write the output to a text file in the `outputDir`.

## Install

```shell
npm install craco-plugin-inspect-config -D
```

## Usage

Add the following to your `craco.config.js` file.

:warning: The plugin is not enabled by default. You must turn it on when you want to use it.

```js
const { inspectConfigPlugin } = require('craco-plugin-inspect-config');

module.exports = {
  // ...
  plugins: [
    // ... put it last
    {
      plugin: inspectConfigPlugin,
      options: {
        enabled: true,
      },
    },
  ],
  // ...
};
```

## Options

This plugin accepts the options from [`util.inspect()`](https://nodejs.org/api/util.html#util_util_inspect_object_options) and the following:

```
{
  enabled: boolean;
  outputDir: string | ((pluginOptions) => string);
  stringify: (config, inspectOptions) => string;
  getFilename: (name) => string;
}
```

If you provide your own `stringify`, also provide `getFilename` so you can customize the extension.

Example:

```js
const { inspectConfigPlugin } = require('craco-plugin-inspect-config');

module.exports = {
  plugins: [
    {
      plugin: inspectConfigPlugin,
      options: {
        enabled: true,
        stringify: config => JSON.stringify(config, null, 2),
        getFilename: name => `${name}.json`,
      },
    },
  ],
};
```

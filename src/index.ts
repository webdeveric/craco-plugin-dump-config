import { join, relative } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

import { createCracoPlugin } from '@webdeveric/craco-plugin';
import findCacheDir from 'find-cache-dir';
import { log } from '@craco/craco/lib/logger';

import type { AnyRecord, CoreOptions } from '@webdeveric/craco-plugin';

export type PluginOptions = {
  outputDir: string | ((pluginOptions: PluginOptions) => string);
  space: number | string;
  stringify: <C>(config: C, pluginOptions: Omit<PluginOptions, 'stringify'>) => string;
  getFilename: (name: string) => string;
};

const dumpConfig =
  (name: string) =>
  <C extends AnyRecord, O extends PluginOptions & CoreOptions>(config: C, pluginOptions: O): typeof config => {
    if (pluginOptions.enabled) {
      try {
        const { stringify, ...otherOptions } = pluginOptions;

        const content = stringify(config, otherOptions);

        const directory =
          typeof pluginOptions.outputDir === 'function'
            ? pluginOptions.outputDir(pluginOptions)
            : pluginOptions.outputDir;

        const output = join(directory, pluginOptions.getFilename(name));

        mkdirSync(directory, { recursive: true });

        writeFileSync(output, content);

        log(`dumpConfig(${name}) written to ${relative(process.cwd(), output)}`);
      } catch (error) {
        console.error(error);
      }
    }

    return config;
  };

export const dumpConfigPlugin = createCracoPlugin<PluginOptions>({
  name: 'Dump Config',
  getOptions: options => ({
    enabled: false,
    space: 2,
    outputDir: () => findCacheDir({ name: 'craco-plugin-dump-config' }) ?? process.cwd(),
    stringify: (config, options) => JSON.stringify(config, null, options.space),
    getFilename: name => `${name}.json`,
    ...options,
  }),
  craco: [dumpConfig('craco')],
  webpack: [dumpConfig('webpack')],
  devServer: [dumpConfig('devServer')],
  jest: [dumpConfig('jest')],
});

export default dumpConfigPlugin;

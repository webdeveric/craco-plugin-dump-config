import { inspect, InspectOptions } from 'util';
import { join, relative } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

import { createCracoPlugin } from '@webdeveric/craco-plugin';
import findCacheDir from 'find-cache-dir';
import { log } from '@craco/craco/lib/logger';

import type { AnyRecord, CoreOptions } from '@webdeveric/craco-plugin';

export type CorePluginOptions = {
  outputDir: string | ((pluginOptions: PluginOptions) => string);
  stringify: <C>(config: C, inspectOptions: InspectOptions) => string;
  getFilename: (name: string) => string;
};

export type PluginOptions = InspectOptions & CorePluginOptions;

const inspectConfig =
  (name: string) =>
  <C extends AnyRecord, O extends PluginOptions & CoreOptions>(config: C, pluginOptions: O): typeof config => {
    if (pluginOptions.enabled) {
      try {
        const { getFilename, outputDir, stringify, ...inspectOptions } = pluginOptions;

        const content = stringify(config, inspectOptions);

        const directory = typeof outputDir === 'function' ? outputDir(pluginOptions) : outputDir;

        const output = join(directory, getFilename(name));

        mkdirSync(directory, { recursive: true });

        writeFileSync(output, content);

        log(`inspectConfig(${name}) written to ${relative(process.cwd(), output)}`);
      } catch (error) {
        console.error(error);
      }
    }

    return config;
  };

export const inspectConfigPlugin = createCracoPlugin<PluginOptions>({
  name: 'Inspect Config',
  getOptions: options => ({
    enabled: false,
    showHidden: false,
    depth: null,
    colors: false,
    outputDir: () => findCacheDir({ name: 'craco-plugin-inspect-config' }) ?? process.cwd(),
    stringify: (config, inspectOptions) => inspect(config, inspectOptions),
    getFilename: name => `${name}.txt`,
    ...options,
  }),
  craco: [inspectConfig('craco')],
  webpack: [inspectConfig('webpack')],
  devServer: [inspectConfig('devServer')],
  jest: [inspectConfig('jest')],
});

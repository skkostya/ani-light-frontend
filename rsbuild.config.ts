import { defineConfig } from '@rsbuild/core';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgr } from '@rsbuild/plugin-svgr';

export default defineConfig(({ env, command }) => {
  const isProd = env === 'production';
  const isDevCommand = command === 'dev' ? true : false;

  return {
    plugins: [pluginReact(), pluginSass(), pluginSvgr(), pluginNodePolyfill()],
    html: {
      template: './public/index.html',
      injectScript: true
    },
    output: {
      publicPath: '/',
      distPath: {
        root: 'build'
      },
      sourceMap: {
        js: isProd ? false : 'cheap-module-source-map',
        css: false
      },
      filename: {
        js: isDevCommand ? '[name].js' : '[name]_script.[contenthash:8].js',
        css: isDevCommand ? '[name].css' : '[name].[contenthash:8].css'
      }
    }
  };
});

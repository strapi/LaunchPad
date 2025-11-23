import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import pkg from './package.json';

export const builtins = [
  'electron',
  ...builtinModules.map((m) => [m, `node:${m}`]).flat(),
];

export const external = [...builtins, ...Object.keys(pkg.dependencies || {})];


export default defineConfig({
  root: '.', 
  build: {
    lib: {
      entry: 'preload.js', // 预加载脚本入口
      formats: ['cjs'],
      fileName: () => 'preload.js',
    },
    rollupOptions: {
      external
    },
    outDir: '.vite',  
    emptyOutDir: true,
  },
});
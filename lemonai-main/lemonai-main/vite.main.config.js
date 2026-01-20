import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import pkg from './package.json';

const builtins = [
  'electron',
  ...builtinModules.map((m) => [m, `node:${m}`]).flat(),
];

const external = [...builtins, ...Object.keys(pkg.dependencies || {})];

export default defineConfig({
  root: '.',
  build: {
    outDir: '.vite',   // 指定构建目录为 .vite
    emptyOutDir: true, // 每次构建前清空目录
    sourcemap: false,
    rollupOptions: {
      input: 'main.js',   // 指定入口文件
      external,
      output: {
        format: 'cjs',
        entryFileNames: 'main.js',  // 生成文件名
      },
    },
    target: 'node16',  // 目标环境（node版本）
    minify: false,     // 主进程一般不开启压缩，方便调试
  },
});

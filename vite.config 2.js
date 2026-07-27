import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base 必须和 GitHub Pages 的路径完全一致，否则线上会白屏。
// 当前部署在 https://phoebewong214.github.io/portfilo/  →  '/portfilo/'
// 如果以后仓库改名，这里跟着改成 '/<新仓库名>/'
// 如果改成用户站点（仓库名 phoebewong214.github.io），改成 '/'
export default defineConfig({
  plugins: [react()],
  base: '/portfilo/',
});

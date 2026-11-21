import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rollupNativePath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');

if (fs.existsSync(rollupNativePath)) {
  let content = fs.readFileSync(rollupNativePath, 'utf8');
  if (!content.includes('@rollup/wasm-node')) {
    content = content.replace(
      /const nativeModule = requireWithFriendlyError\([\s\S]*?\);/,
      `let nativeModule;
try {
\tnativeModule = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
} catch (e) {
\ttry {
\t\tnativeModule = require('@rollup/wasm-node/dist/native.js');
\t} catch (e2) {
\t\tthrow e;
\t}
}`
    );
    fs.writeFileSync(rollupNativePath, content, 'utf8');
    console.log('✓ Rollup wasm fallback patched successfully');
  }
}

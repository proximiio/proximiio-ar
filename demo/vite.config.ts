import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import debug from 'vite-plugin-debug';

export default defineConfig({
	plugins: [
		basicSsl(),
		debug({
			enabled: true,
			apply: 'serve',
			tool: 'eruda',
		}),
	],
	server: {
		host: true,
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..'],
		},
	},
});

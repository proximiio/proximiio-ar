import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load env file based on `mode` in the current working directory.
	// Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
	const env = loadEnv(mode, process.cwd(), '');
	return {
		// vite config
		plugins: [
			react(),
			basicSsl(),
			VitePWA({
				registerType: 'autoUpdate',
				base: `${env.BASE_URL}/`,
				includeAssets: [
					'favicon.ico',
					'apple-touch-icon.png',
					'masked-icon.svg',
				],
				workbox: {
					maximumFileSizeToCacheInBytes: 3000000,
				},
				manifest: {
					name: env.VITE_APP_TITLE,
					short_name: 'Wayfinding',
					description: 'Wayfinding client demo application by Proximi.io',
					icons: [
						{
							src: `${env.BASE_URL}/android-chrome-192x192.png`,
							sizes: '192x192',
							type: 'image/png',
							purpose: 'favicon',
						},
						{
							src: `${env.BASE_URL}/android-chrome-512x512.png`,
							sizes: '512x512',
							type: 'image/png',
							purpose: 'favicon',
						},
						{
							src: `${env.BASE_URL}/apple-touch-icon.png`,
							sizes: '180x180',
							type: 'image/png',
							purpose: 'apple touch icon',
						},
						{
							src: `${env.BASE_URL}/maskable_icon.png`,
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						},
					],
					theme_color: '#ffffff',
					background_color: '#000000',
				},
			}),
			viteCompression(),
		],
		base: env.BASE_URL,
		preview: {
			port: +env.PORT,
			strictPort: true,
		},
		server: {
			port: +env.PORT,
			strictPort: true,
			host: true,
			fs: {
				// Allow serving files from one level up to the project root
				allow: ['..'],
			},
			// origin: `http://127.0.0.1:${+env.PORT}`,
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		esbuild: {
			drop: ['console', 'debugger'],
		},
		build: {
			sourcemap: true,
			rollupOptions: {
				output: {
					manualChunks: {
						proximiio: ['proximiio-js-library'],
						react: [
							'react',
							'react-dom',
							'react-country-flag',
							'react-i18next',
							'react-icons',
							'react-use',
						],
						radix: [
							'@radix-ui/react-dialog',
							'@radix-ui/react-dropdown-menu',
							'@radix-ui/react-popover',
							'@radix-ui/react-slot',
							'@radix-ui/react-toggle',
							'@radix-ui/react-toggle-group',
							'@radix-ui/react-tooltip',
						],
						geolib: ['geolib'],
						framer: ['framer-motion'],
					},
				},
			},
		},
	};
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			},
			manifest: {
				name: 'ClassTask',
				short_name: 'ClassTask',
				description: 'A task tracking app for university students.',
				start_url: '/',
				display: 'standalone',
				background_color: '#5057FF',
				theme_color: '#4095FF',
				icons: [
					{
						src: '/apple-touch-icon-180x180.png',
						sizes: '180x180',
						type: 'image/png'
					},
					{
						src: '/maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/pwa-64x64.png',
						sizes: '64x64',
						type: 'image/png'
					},
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
});

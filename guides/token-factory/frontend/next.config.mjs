/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: false,

	webpack: (config, { isServer }) => {
		config.externals.push('pino-pretty', 'lokijs', 'encoding');

		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false
			};
		}

		config.module = {
			...config.module,
			exprContextCritical: false,
		};

		return config;
	},
};

export default nextConfig;

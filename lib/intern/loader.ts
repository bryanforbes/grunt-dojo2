/// <reference types="@dojo/loader"/>

declare const shimAmdDependencies: any;

intern.registerLoader(async (options) => {
	await intern.loadScript('node_modules/@dojo/loader/loader.js');
	await intern.loadScript('node_modules/@dojo/shim/util/amd.js');

	const globalObj: any = typeof window !== 'undefined' ? window : global;
	const require: DojoLoader.RootRequire = globalObj.require;

	const { packages = [], baseUrl = intern.config.basePath } = options;
	require.config(shimAmdDependencies({
		baseUrl,
		...options,
		packages: [
			...packages, ...[
				{ name: 'sinon', location: 'node_modules/sinon/pkg', main: 'sinon' }
			]
		]
	}));

	// load @dojo/shim/main to import the ts helpers
	await new Promise<void>((resolve) => {
		require(['@dojo/shim/main'], () => resolve());
	});

	return (modules: string[]) => {
		return new Promise<void>((resolve) => {
			require(modules, () => resolve());
		});
	};
});

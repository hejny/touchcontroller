const configs = [];
configs.push(
    Object.assign({}, require('./webpack.common.config.js'), {
        mode: 'production',
        output: {
            filename: 'touchcontroller.js',
            path: __dirname + '/dist/',
            libraryTarget: 'commonjs',
        },
    }),
);
configs.push(
    Object.assign({}, require('./webpack.common.config.js'), {
        mode: 'production',
        output: {
            filename: 'touchcontroller.browser.js',
            path: __dirname + '/dist/',
            libraryTarget: 'var',
            library: 'TouchController',
        },
    }),
);

module.exports = configs;

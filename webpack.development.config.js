const configs = [];

configs.push(
    Object.assign({}, require('./webpack.common.config.js'), {
        mode: 'development',
        output: {
            filename: 'touchcontroller.dev.browser.js',
            path: __dirname + '/dist/',
            libraryTarget: 'var',
            library: 'TouchController',
        },
    }),
);

module.exports = configs;

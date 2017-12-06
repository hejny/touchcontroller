module.exports = {

    entry: {
        first: __dirname + '/src/index'
    },
    output: {
        filename: 'touchcontroller.js',
        path: __dirname + "/dist/",
        libraryTarget: "commonjs"
    },

    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }



    /*
     plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
                output: {
                    comments: false,
                },
            }),
        ]
    */
}
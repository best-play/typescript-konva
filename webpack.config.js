module.exports = {
    entry: {
        'js/app.js': './src/index.ts', // scripts
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'css']
    },
    output: {
        path: __dirname + '/dist/',
        filename: "[name]"
    }
};

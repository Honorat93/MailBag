// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: './src/code/main.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: { extensions: [ ".ts", ".tsx", ".js"] },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Correction ici : .src -> ./src
            filename: 'index.html'
        }),

        // Ajouter vos plugins ici
        // Apprenez-en plus sur les plugins sur https://webpack.js.org/configuration/plugins/
    ],
    performance: { hints: false },
    watch: true,
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
            {
                test: /\.html$/,
                use: { loader: "html-loader" },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
            // Ajouter des règles pour des modules personnalisés ici
            // Apprenez-en plus sur les chargeurs sur https://webpack.js.org/loaders/
        ],
    },
      
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
    } else {
        config.mode = 'development';
    }
    return config;
};

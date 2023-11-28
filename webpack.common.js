const path = require("path");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = {
    resolve: {
        extensions: [".ts", ".js"],
    },
    performance: {
        maxAssetSize: 500000,
        maxEntrypointSize: 500000,
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: "src/index.html",
                "frames/clock": "src/views/frames/Clock.html",
                "frames/weather": "src/views/frames/Weather.html",
            },
            loaderOptions: {
                preprocessor: "eta",
                preprocessorOptions: {
                    async: false,
                    useWith: true,
                    views: "src/views",
                },
            },
            js: {
                filename: "assets/js/[name].[contenthash:8].js",
            },
            css: {
                filename: "assets/css/[name].[contenthash:8].css",
            },
        }),
        new CopyPlugin({
            patterns: [
                { from: "src/assets/logo.svg", to: "assets/img/logo.svg" },
            ],
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: "css-loader",
            },
            {
                test: /[\\/]fonts|node_modules[\\/].+(woff(2)?|ttf|otf|eot|svg)$/i,
                type: "asset/resource",
                generator: {
                    // keep original directory structure
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    filename: ({ filename }) => {
                        const srcPath = "css/fonts";
                        const regExp = new RegExp(`[\\\\/]?(?:${path.normalize(srcPath)}|node_modules)[\\\\/](.+?)$`);
                        const assetPath = path.dirname(regExp.exec(filename)[1].replace("@", "").replace(/\\/g, "/"));
                        return `assets/fonts/${assetPath}/[name][ext][query]`;
                    },
                },
            },
            {
                test: /\.(ico|png|jp?g|webp)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/img/[name][hash:8][ext][query]",
                },
            },
            {
                test: /manifest\.json$/,
                type: "asset/resource",
                generator: {
                    filename: "manifest.json",
                },
            },
        ],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};

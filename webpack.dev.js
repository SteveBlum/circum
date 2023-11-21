const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, "dist"),
        watchFiles: {
            paths: ["src/**/*.*"],
            options: {
                usePolling: true,
            },
        },
    },
});

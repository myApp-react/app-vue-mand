const path = require("path");
let configs = require("./src/devconfigs/index")

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    baseUrl: '/',
    lintOnSave: true,
    chainWebpack: config => {
        config.resolve.alias
        // .set("api", resolve("src/api"))
            .set("views", resolve("src/views"));
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, {limit: 10240}));
        const svgRule = config.module.rule('svg')

        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()

        // 添加要替换的 loader
        svgRule
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
    devServer: {
        // 设置代理
        proxy: configs.proxyConfig
    }
};

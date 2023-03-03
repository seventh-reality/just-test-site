module.exports = {
    lintOnSave: true,
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title = "Agappe Products Showcase";
            return args;
        });
    }
};

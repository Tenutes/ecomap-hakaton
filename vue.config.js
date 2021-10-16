module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 8080,
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(args => {
        args.compilerOptions.whitespace = 'preserve';
      });
    config.plugins.delete('prefetch');
  },
};

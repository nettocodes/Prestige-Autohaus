const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(), // Analise o tamanho do bundle
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 20000, // Tamanho mínimo para divisão
        maxSize: 50000, // Tamanho máximo para divisão
        automaticNameDelimiter: "-",
      },
    },
  },
  productionSourceMap: false, // Remove source maps na produção
};

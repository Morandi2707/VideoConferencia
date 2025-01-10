const path = require("path");

module.exports = {
  entry: "./src/index.js", // O ponto de entrada do seu código
  output: {
    path: path.resolve(__dirname, "dist"), // O diretório de saída
    filename: "bundle.js", // O nome do arquivo de saída
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader", // Usado para transpilar o código com Babel
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // Usado para importar arquivos CSS
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3000,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      console.log("Configuração personalizada dos middlewares.");
      return middlewares;
    },
  },
};

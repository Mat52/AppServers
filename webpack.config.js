var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //   entry: "./src/index.js",
  entry: {
    intro: "./src/static/intro.js",
  },
  output: {
    filename: "[name].js", // bundle.js to wynik kompilacji projektu przez webpacka
  },
  mode: "development", // none, development, production
  devServer: {
    port: 8080,
  },

  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: "./intro.html",
      title: "Mahjong",
      template: "./src/static/intro.html",
      chunks: ["intro"],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: "images/[hash]-[name].[ext]",
            },
          },
        ],
      },
    ],
  },
};

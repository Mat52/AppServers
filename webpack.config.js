var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  //   entry: "./src/index.js",
  entry: {
    intro: "./src/static/intro.js",
    game: "./src/static/game.js",
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
      filename: "intro.html",
      title: "Mahjong",
      template: "src/static/intro.html",
      chunks: ["intro"],
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: "game.html",
      title: "Mahjong",
      template: "src/static/game.html",
      chunks: ["game"],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|fbx)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // limit: 8000, // Convert images < 8kb to base64 strings
              name: "/src/images/[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
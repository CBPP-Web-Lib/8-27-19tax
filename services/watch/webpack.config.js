var path = require('path');

module.exports = {
  mode: 'development',
  entry: './app/src/app.js',
  watch: true,
  cache: false,
  output: {
    path: path.resolve(__dirname, 'app/dev'),
    filename: 'app.js'
  },
  devtool: 'inline-source-map',
  resolve: {
    modules: [__dirname, 'app/node_modules'],
  },
  resolveLoader: {
    modules: [__dirname, 'app/node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name][ext]",
        },
      },
      {
        test: /\.(html)$/i,
        use: "raw-loader"
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ],
      },
      {
        test: /\.twig$/,
        loader: "twig-loader"
      }
    ],
  }
};
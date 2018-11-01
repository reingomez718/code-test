const path = require('path');
const webpack = require('webpack');
const dateFormat = require('dateformat');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BannerPlugin = webpack.BannerPlugin;
const config = require('./package.json');

const projectDir = path.resolve(__dirname);
const baseFilename = config.name + '-' + config.version;
const jsFilename = baseFilename + '.min.js';
const cssFilename = baseFilename + '.css';

function buildBanner(filename) {
  const now = new Date();
  const year = now.getFullYear();
  const formattedDate = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');
  const banner = '' +
    '@license ' + filename + '\n' +
    'Copyright (c) ' + year + ' Rakuten.Inc\n' +
    'Date: ' + formattedDate;
  return banner;
}

module.exports = env => {
  const productionMode = env ? env.production : false;
  const loaders = [];
  const plugins = [];

  // babel
  loaders.push({
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  });

  // load sass and transpile it to browser compatible css
  const extractSass = new ExtractTextPlugin({
    filename: cssFilename
  });
  loaders.push({
    test: /\.(scss|css)$/,
    use: extractSass.extract({
      use: ['css-loader', 'postcss-loader', 'sass-loader'],
      fallback: 'style-loader'
    })
  });
  plugins.push(extractSass);

  // load html
  loaders.push({
    test: /\.html$/,
    exclude: /views/,
    use: [{
      loader: 'html-loader',
      options: {
        minimize: true,
      }
    }]
  });

  // Inject js/css link to the view html
  plugins.push(new HtmlWebpackPlugin({
    template: path.join(projectDir, 'src', 'views', 'index.html'),
    inject: 'body'
  }));

  // clean old build directory
  plugins.push(new CleanWebpackPlugin(
    ['dist'],
    { root: projectDir }
  ));

  if (productionMode) {
    // minify js
    plugins.push(new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          ascii_only: true
        }
      }
    }));

    // add copyright banner into js/css
    plugins.push(new BannerPlugin({
      test: /\.js$/,
      banner: buildBanner(jsFilename)
    }));
    plugins.push(new BannerPlugin({
      test: /\.css$/,
      banner: buildBanner(cssFilename)
    }));
  }

  // webpack config
  const config = {
    entry: path.join(projectDir, 'src', 'public', 'index.js'),
    output: {
      path: path.join(projectDir, 'dist'),
      filename: jsFilename
    },
    module: { rules: loaders },
    plugins: plugins,
    devtool: 'source-map'
  };

  if (!productionMode) {
    config.devServer = {
      contentBase: path.join(projectDir, 'public'),
      compress: true,
      port: 9000
    };
  }

  return config;
};

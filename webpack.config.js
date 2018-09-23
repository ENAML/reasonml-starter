const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * config
 * -----------
 */
const isProd = process.env.NODE_ENV === 'production';
const isDevServer = process.argv.find(v => v.includes('webpack-dev-server')) != null;

const ROOT = path.resolve(__dirname);
const BS_ROOT = path.resolve(ROOT, `lib/es6`);
const ENTRY = path.resolve(BS_ROOT, 'src/Index.bs.js');

const OUTPUT_DIR = "dist/";

/**
 * webpack config obj
 * --------------------
 */
module.exports = {
  entry: ENTRY,

  mode: isProd ? 'production' : 'development',
  devtool: isDevServer ? 'eval-source-map' : 'source-map',

  ...(()=> {
    if (isDevServer) {
      return {};
    }

    if (!isProd) {
      // UGLIFY : DEV
      const uglifyOptions = {
        warnings: true,
        compress: {
          hoist_funs: true,
          hoist_vars: true,
          // passes: 2,
          toplevel: true,
        },
        mangle: false,
        output: {
          beautify: true,
          preamble: `/**\n* ===============\n* ENAML // DEV\n* ===============\n*/`,
          comments: true,
          bracketize: true,
        },
        keep_classnames: true,
        keep_fnames: true,

      };
      console.log(`dev build uglify opts: `);
      console.log(uglifyOptions);
      return {
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              sourceMap: true,
              uglifyOptions
            }),
          ]
        }
      };
    }
    else {
      // UGLIFY : PROD
      const uglifyOptions = {
        warnings: true,
        compress: {
          hoist_funs: true,
          hoist_vars: true,
          passes: 4,
          toplevel: true,
        },
        output: {
          // beautify: true,
          preamble: `/**\n* ===============\n* ENAML // PROD\n* ===============\n*/`,
        },
      };
      return {
        optimization: {
          minimizer: [
            new UglifyJsPlugin({
              sourceMap: true,
              uglifyOptions
            }),
          ]
        }
      };
    }
  })(),

  output: {
    path: path.resolve(ROOT, OUTPUT_DIR),
    // publicPath: OUTPUT_DIR,
    filename: 'main.js',
  },

  plugins: [
    (()=> {
      const minify = !isProd ? false : {
        minifyCSS: true,
        collapseWhitespace: true,
      };

      const opts = {
        // config:
        filename: 'index.html',
        template: 'public/index.html',
        minify,
        // tmpl:
        title: 'TEST APP TITLE',
      };
      return new HtmlWebpackPlugin(opts);
    })(),
    // TODO
  ],

  devServer: {
    contentBase: path.resolve(ROOT, "public/"),
    // publicPath: OUTPUT_DIR,
    compress: true,
    // historyApiFallback: true,
    port: 9000
  },

};

const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: {
    club: './src/client/club.ts'
  },
  output: {
    path: path.resolve(__dirname, 'app/public/js'),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
          }
        ]
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    },
    extensions: ['.tsx', '.ts', '.js', '.vue', '.json']
  }, 
  plugins: [
    new VueLoaderPlugin()
  ],
  devtool: '#eval-source-map'
}

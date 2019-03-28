const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
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
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.tsx', '.ts', '.js', '.vue', '.json']
  }, 
  plugins: [
    new VueLoaderPlugin()
  ]
}
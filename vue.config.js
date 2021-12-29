// const webpack = require('webpack')
const externalsConfig = require('./externals.config')
process.env.VUE_APP_EXTERNALS_SCRIPT = externalsConfig.externalsScript
const css = process.env.NODE_ENV === 'development'
  ? {} : {
    extract: {
      filename: 'css/vs.[hash:8].css'
    }
  }

const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    config.module.rules.delete('svg') // 重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  pluginOptions: {
    i18n: {
      locale: 'zh-cn',
      fallbackLocale: 'zh-cn',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  devServer: {
    port: 8081, // 启动端口
    open: true, // 启动后是否自动打开网页
    overlay: {
      warnings: true,
      errors: true
    }
  },
  productionSourceMap: false,
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
    loaderOptions: {
      sass: {
        sourceMap: process.env.NODE_ENV === 'development',
        data: `
           @import "@/styles/color-variables.scss";
        `
      }
    },
    ...css
  },
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ['*', '.mjs', '.js', '.vue', '.json']
    },
    module: {
      rules: [
        {
          type: 'javascript/auto',
          test: /\.mjs$/
        }
      ]
    },
    plugins: [
      new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
        openAnalyzer: false
      })
    ],
    externals: externalsConfig.externals,
    output: {
      filename: 'js/vs.[hash:8].js'
      // chunkFilename: 'js/vs-[name].[hash:8].js',
    }
    // plugins: [
    //   new webpack.IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/)
    // ]
  }
}

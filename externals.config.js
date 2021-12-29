/**
 * Created by LiuLei on 2019-01-28
 */

const hasExternals = process.env.VUE_APP_HAS_WEBPACK_EXTERNALS === 'true'
const externals = [
 
]

module.exports = {
  hasExternals,
  externals: hasExternals ? externals.reduce((pre, cur) => {
    pre[cur.name] = cur.externalName
    return pre
  }, {}) : {},
  externalsScript: hasExternals ? externals.map(external => `<script src="${external.url}"></script>`).join('') : ``
}

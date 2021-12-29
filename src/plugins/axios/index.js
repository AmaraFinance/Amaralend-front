'use strict'

import axios from 'axios'
// import { Message } from 'element-ui'
// import i18n from '@/i18n'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.VUE_APP_API || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let config = {
  // baseURL: process.env.VUE_APP_API || '',
  baseURL: 'https://api.amara.finance/',
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control

  transformRequest: [
    function (data, headers) {
      if (data && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        return Object.entries(data).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
      }
      return data
    }
  ],
  // set request header
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    // TODO error code handler
    let { data = {} } = response
    data = data || {}

    return response.data
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

/* Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
} */

export default _axios

import axios from '@/plugins/axios'

export function getList (url, params) {
  return axios.post(url, params)
}

export function totalList (params) {
  return axios.post('/api/total/totalList', params)
}

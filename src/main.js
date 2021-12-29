import Vue from 'vue'
import App from './App'
import router from './router'

import '../theme/index.css'
import './styles/color-variables.scss'
import './styles/zcm-main.css'
import i18n from './i18n.js';
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;

import $envConfig from '@/common/config.js';
Vue.prototype.$envConfig = $envConfig;
Vue.$envConfig = Vue.prototype.$envConfig;

import $tools from '@/common/tools.js';
Vue.prototype.$tools = $tools;
Vue.$tools = Vue.prototype.$tools;

import store from '@/store';
Vue.$store = store;
Vue.prototype.$store = store;



// let vuexStore = require('@/store/$u.mixin.js');
// Vue.mixin(vuexStore);
import * as ethers from "ethers";
import Unitroller from '@/handlers/unitroller';
import Token from '@/handlers/token';
import AmaraLendLensTool from '@/handlers/AmaraLendLensTool';
import AmaraLendLens from '@/handlers/AmaraLendLens';
// import Stake from '@/handlers/stake';

async function appInit() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  const wallet = provider.getSigner();
  // let address = await wallet.getAddress();

  if (!wallet) {
    Vue.$wallet = {};
    Vue.prototype.$wallet = {}
    return;
  }
  Vue.$wallet = wallet;
  Vue.prototype.$wallet = wallet;

  Vue.prototype.$unitroller = await new Unitroller($envConfig.VUE_APP_UNICONTROLLER);
  Vue.$unitroller = Vue.prototype.$unitroller;
  Vue.prototype.$amaraToken = await new Token($envConfig.VUE_APP_TOKEN);
  Vue.$amaraToken = Vue.prototype.$amaraToken;
  Vue.$Amara = await new AmaraLendLensTool($envConfig.VUE_AmaraLendLens);
  Vue.prototype.$Amara = Vue.$Amara;
  let AmaraLendLens_ = await new AmaraLendLens($envConfig.VUE_AmaraLendLens2, wallet);
  Vue.$AmaraLendLens = AmaraLendLens_;
  Vue.prototype.$AmaraLendLens = AmaraLendLens_;
  // Vue.$BaseStake = await new Stake($envConfig.STAKE_POOL);
  // Vue.prototype.$BaseStake = Vue.$BaseStake;
}
appInit();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app")

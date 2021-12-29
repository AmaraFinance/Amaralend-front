var config, debug = true;
// if (window.ethereum && window.ethereum.chainId == 56) {
//   debug = false
// }
let chainId = 1287;
switch(chainId){
	case 1287:
		config = {
		  VUE_APP_NETWORK_ID: '0x507',
		  VUE_APP_HTTP_PROVIDER: 'https://rpc.testnet.moonbeam.network',
		  VUE_APP_WS_PROVIDER: 'wss://wss.testnet.moonbeam.network',
		  VUE_APP_UNICONTROLLER: '0xBE4B4728f80E1a6C5bd696a8f341c3426D7b3Cb3',
		  VUE_APP_TOKEN: '0x41C1479454E06A895bcE7Eb3ED0625Fa0Fd1D28A',
		  VUE_AmaraLendLens: '0xcE40AFF4bdD4F10D14386DE11510841386eb76EA',
      VUE_AmaraLendLens2: '0xE4b2a78aeADB06f60f17FfB3255C493879A56E8C',
      VUE_APlatformToken: '0x0A55B26f2f69AE1E8eD47c242DDc34D3AB993ddE',
      STAKE_POOL:'0x06F8229817850B706Db41E3a068037A6fb94F245',
		}
		break;
}

export default config

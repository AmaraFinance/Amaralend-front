import AmaraLendLensToolContract from '@/contracts/AmaraLendLensTool.json';
import {
	send,
	web3
} from '@/handlers';
import * as constants from '@/store/constants';
import BN from 'bignumber.js';
import _ from 'lodash';
import envConfig from '@/common/config.js';



const blocksPerDay = 2 * 60 * 24;
const daysPerYear = 365;
const factor = 1e18;

/**
 * A blockchain transaction response.
 * @typedef {Object} TXResult
 */

/**
 * Market handler
 */
export default class AmaraLendLensTool {
	/**
	 * Market handler constructor
	 * @param {string} address On chain `Market` deployed address.
	 * @param {object} config of the network { chainId: WEB_SOCKETS_PROVIDER }
	 * @return {Error}
	 */
	constructor(address = '') {
		this.instanceAddress = address; // TODO .toLowerCase();
		if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return new Error('Missing address');
		this.instance = new web3.eth.Contract(AmaraLendLensToolContract.abi, address);
	}

	/**
	 * Market address
	 * @return {string} this market instance address.
	 */
	get address() {
		return this.instanceAddress;
	}

	getATokenMetadata(marketAddress){
		return new Promise((resolve, reject) => {
			resolve([0,0,0])
			// this.instance.methods.ATokenMetadata(marketAddress).call()
			// 	.then(resolve)
			// 	.catch((err)=>{
			// 		console.log(err)
			// 		reject(err);
			// 	});
		});
	}
	
	calcAccountAllAccrued(from='', marketList){
		return new Promise((resolve, reject) => {
			resolve(0)
			// this.instance.methods.calcAccountAllAccrued(from, marketList).call()
			// 	.then((Accrued) => Number(Accrued))
			// 	.then(resolve)
			// 	.catch((err)=>{
			// 		console.log(err)
			// 		reject(err);
			// 	});
		});
	}

}

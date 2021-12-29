import SimplePriceOracleContract from '@/contracts/SimplePriceOracle.json';
import Token from '@/handlers/token';
import {
	send,
	web3
} from '@/handlers';
import * as constants from '@/store/constants';
import BN from 'bignumber.js';
import _ from 'lodash';
import envConfig from '@/common/config.js';



/**
 * A blockchain transaction response.
 * @typedef {Object} TXResult
 */

/**
 * Market handler
 */
export default class PriceOracle {
	/**
	 * Market handler constructor
	 * @param {string} address On chain `Market` deployed address.
	 * @param {object} config of the network { chainId: WEB_SOCKETS_PROVIDER }
	 * @return {Error}
	 */
	constructor(address = '') {
		this.instanceAddress = address; // TODO .toLowerCase();
		if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return new Error('Missing address');
		this.instance = new web3.eth.Contract(SimplePriceOracleContract.abi, address);
	}

	/**
	 * Market address
	 * @return {string} this market instance address.
	 */
	get address() {
		return this.instanceAddress;
	}
	
	/**
	 * Returns an eventual blocks per year of this market.
	 * @return {Promise<number>} eventual blocks per year.
	 */
	getUnderlyingPrice(ATokenAddress) {
		return new Promise((resolve, reject) => {
			this.instance.methods.getUnderlyingPrice(ATokenAddress).call()
				.then(resolve)
				.catch(reject);
		});
	}

	getAssertsPrice(tokenAddress){
		return new Promise((resolve, reject) => {
			this.instance.methods.assetPrices(tokenAddress).call()
				.then(resolve)
				.catch(reject);
		});
	}

}

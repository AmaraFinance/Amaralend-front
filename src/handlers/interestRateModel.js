import InterestRateModeContract from '@/contracts/WhitePaperInterestRateModel.json';
import Token from '@/handlers/token';
import {
	send,
	web3
} from '@/handlers';
import * as constants from '@/store/constants';
// import Web3 from 'web3';
import BN from 'bignumber.js';
import _ from 'lodash';
import envConfig from '@/common/config.js';
import $tools from '@/common/tools.js'
const BigNumber = require('bignumber.js');


/**
 * A blockchain transaction response.
 * @typedef {Object} TXResult
 */

/**
 * Market handler
 */
export default class InterestRateMode {
	/**
	 * Market handler constructor
	 * @param {string} address On chain `Market` deployed address.
	 * @param {object} config of the network { chainId: WEB_SOCKETS_PROVIDER }
	 * @return {Error}
	 */
	constructor(address = '') {
		this.instanceAddress = address; // TODO .toLowerCase();
		if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return new Error('Missing address');
		this.instance = new web3.eth.Contract(InterestRateModeContract.abi, address);
	}

	/**
	 * Market address
	 * @return {string} this market instance address.
	 */
	get address() {
		return this.instanceAddress;
	}

	get mantissa() {
		return Math.pow(10, 18);
	}

	/**
	 * Returns an eventual blocks per year of this market.
	 * @return {Promise<number>} eventual blocks per year.
	 */
	getBlocksPerYear() {
		return new Promise((resolve, reject) => {
			this.instance.methods.blocksPerYear().call()
				.then((blocksPerYear) => Number(blocksPerYear))
				.then(resolve)
				.catch(reject);
		});
	}

	/**
	 * Returns an eventual borrow rate, it varies depending on the total borrows
	 * and cash of this market.
	 * @return {Promise<number>} eventual market's borrow rate.
	 */
	getBorrowRate(cash, borrows, reserves) {
		return new Promise((resolve, reject) => {
			this.instance.methods.getBorrowRate(cash, borrows, reserves).call().then((borrowRate) => {
				return borrowRate.toNumber();
			})
				.then(resolve)
				.catch(reject);
		});
	}

	/**
	 * Returns an eventual borrow rate, it varies depending on the total borrows
	 * and cash of this market.
	 * @return {Promise<number>} eventual market's borrow rate.
	 */
	getSupplyRate(cash, borrows, reserves, reserveFactorMantissa) {
		return new Promise((resolve, reject) => {
			this.instance.methods.getSupplyRate(cash, borrows, reserves, reserveFactorMantissa).call()
				.then((
					supplyRate
				) => {
					return supplyRate.toNumber();
				})
				.then(resolve)
				.catch(reject);
		});
	}

  utilizationRate(cash, borrows, reserves) {
    if (borrows <= 0) {
      return 0
    }
    let x = new BigNumber(cash).plus(new BigNumber(borrows))
    let res =  new BigNumber(borrows).div(new BigNumber(x).minus(new BigNumber(reserves)))
    let utilRate = res.dp(2).toNumber()
    return utilRate
  // 	return new Promise((resolve, reject) => {
  // 		this.instance.methods.utilizationRate(400140259973516700, 626608323436896400,216801677457813).call()
  // 			.then((
  // 				utilRate
  // 			) => {
  //         console.log('utilRate',utilRate)
  // 				//return utilRate.toNumber();
  // 			})
  // 			.then(resolve)
  // 			.catch(reject);
  // 	});
  }


}

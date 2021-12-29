import AmaraLendLensContract from '@/contracts/AmaraLendLens.json';
import {
	send,
	web3
} from '@/handlers';
import * as constants from '@/store/constants';
import BN from 'bignumber.js';
import _ from 'lodash';
import envConfig from '@/common/config.js';
import {
	Contract,
	BigNumber
} from "ethers";



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
export default class AmaraLendLens {
	/**
	 * Market handler constructor
	 * @param {string} address On chain `Market` deployed address.
	 * @param {object} config of the network { chainId: WEB_SOCKETS_PROVIDER }
	 * @return {Error}
	 */
	constructor(address = '', wallet) {
		this.wallet = wallet;
		this.instanceAddress = address; // TODO .toLowerCase();
		if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return new Error('Missing address');
		this.instance = {}
		this.instance.methods = new Contract(address, AmaraLendLensContract.abi, wallet);
	}

	/**
	 * Market address
	 * @return {string} this market instance address.
	 */
	get address() {
		return this.instanceAddress;
	}

	ATokenMetadata(marketAddress){
		return new Promise((resolve, reject) => {
			this.instance.methods.aTokenMetadata(marketAddress)
				.then(resolve)
				.catch((err)=>{
					console.log(err)
					reject(err);
				});
		});
	}

	ATokenMetadataAll(marketList){
		return new Promise((resolve, reject) => {
			this.instance.methods.aTokenMetadataAll(marketList)
				.then(resolve)
				.catch((err)=>{
					console.log(err)
					reject(err);
				});
		});
	}

	ATokenBalances(marketAddress, from){
		return new Promise((resolve, reject) => {
			this.instance.methods.aTokenBalances(marketAddress, from)
				.then(resolve)
				.catch((err)=>{
					console.log(err)
					reject(err);
				});
		});
	}

}

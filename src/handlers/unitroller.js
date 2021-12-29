import ComptrollerContract from '@/contracts/ComptrollerV2.json';
import ATokenDelegator from '@/handlers/aToken.js';
import AEther from '@/handlers/aEther.js';
import PriceOracle from '@/handlers/priceOracle.js';
import Token from '@/handlers/token';
import {
  send,
  web3
} from '@/handlers';
import * as constants from '@/store/constants';
import _ from 'lodash';
import envConfig from '@/common/config.js';
/**
 * A blockchain transaction response.
 * @typedef {Object} TXResult
 */

export default class Unitroller {
  /**
   * Controller handler constructor.
   * @param {string} address On chain `Controller` deployed address.
   * @return {Error}
   */
  constructor(address = '') {
    this.instanceAddress = address; // TODO .toLowerCase();
    if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return new Error('Missing address');
    this.instance = new web3.eth.Contract(ComptrollerContract.abi, address);
    this.instancePriceOracle = this.instance.methods.oracle().call().then((priceOracleAddress) => new PriceOracle(
      priceOracleAddress)).catch((err)=> {console.log(err)});
  }

  /**
   * Controller address.
   * @return {string} this controller instance address.
   */
  get address() {
    return this.instanceAddress;
  }

  get mantissa() {
    return Math.pow(10, 18);
  }

  getAssetsIn(account) {
    return new Promise(async (resolve, reject) => {
      this.instance.methods.getAssetsIn(account).call()
        .then((Assets) => Assets)
        .then(resolve)
        .catch(reject);
    });
  }

  getTestAction(market) {
    return new Promise(async (resolve, reject) => {
      this.instance.methods.getTestAction(market).call()
        .then(resolve)
        .catch(reject);
    });
  }

  getCompAccrued(account) {
    return new Promise(async (resolve, reject) => {
      this.instance.methods.compAccrued(account)
        .then((compAccrued) => Number(compAccrued))
        .then(resolve)
        .catch(reject);
    });
  }


  /**
   * Returns an eventual value for the size of registered markets
   * within this controller.
   * @return {Promise<number>} eventual market list size.
   */
  getMarketList() {
    return new Promise(async (resolve, reject) => {
      this.instance.methods.getAllMarkets().call()
        .then((marketList) => marketList)
        .then(resolve)
        .catch(reject);
    });
  }


  /**
   * Returns the current price for a given market.
   * @param marketAddress address of the registered market in this controller.
   * @return {Promise<number>} eventual price for a given market in this controller.
   */
  getMarketPrice(marketAddress) {
    return new Promise((resolve, reject) => {
      this.instancePriceOracle.then((instance) => {
          return instance.getUnderlyingPrice(marketAddress);
        }).then((price) => Number(price))
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Account values
   * @typedef {Object} AccountValues
   * @property {number} supplyValue
   * @property {number} borrowValue
   */



  /**
   * Returns the liquidity for a given account according to its current state in all the markets.
   * @param {string} account
   * @return {Promise<number>} eventual liquidity
   */
  getAccountLiquidity(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getAccountLiquidity(account).call()
        .then((liquidity) => {
          return liquidity[1];
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Returns the address of the market registered at certain index.
   * @param {number} marketIdx Market index position
   * @return {Promise<string>}
   */
  getMarketAddress(marketIndex) {
    return new Promise((resolve, reject) => {
      this.instance.methods.allMarkets(marketIndex).call()
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Returns an address if the markets exists, it would be the market address
   * otherwise it throws an error.
   * @param {string} tokenAddress
   * @return {Promise<string | Error>}
   */
  getMarketAddressByToken(ATokenAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.markets(ATokenAddress).call()
        .then((marketAddress) => {
          if (marketAddress.match(/0x[0]{40}/)) throw new Error(
            'Token address not registered');
          return marketAddress;
        })
        .then(resolve)
        .catch(reject);
    });
  }


  /**
   * Returns the list of existing markets.
   * @return {Promise<[Market]>}
   */
  markets() {
    return this.getMarketList()
      .then((marketList) => marketList.map((marketAddress) => {
        if(marketAddress ==  envConfig.VUE_APlatformToken ){
          return new AEther(marketAddress);
        }else{
          return new ATokenDelegator(marketAddress)
        }
      }));
  }

  /**
   * Gets an eventual instance of the specified market either by its position in the market list or
   * by its on chain deployed market address.
   * @param {string|number} id either the position in the market list array or its on chain deployed
   * market address.
   * @return {Promise<Market>} eventual market instance
   */
  eventualMarket(id) {
    return new Promise((resolve, reject) => {
      if (typeof id === 'string') {
        this.markets()
          .then((markets) => markets.filter((market) => market.address === id)
            .pop())
          .then((result) => {
            if (result === undefined) {
              throw new Error('There is no market with that address');
            }
            return result;
          })
          .then(resolve)
          .catch(reject);
      }
      return this.markets()
        .then((markets) => markets[id])
        .then((result) => {
          if (result === undefined) {
            throw new Error('There is no market at this index');
          }
          return result;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  mintGuardianPaused(marketAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.mintGuardianPaused(marketAddress).call()
        .then(resolve)
        .catch(reject);
    });
  }

  borrowGuardianPaused(marketAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.borrowGuardianPaused(marketAddress).call()
        .then(resolve)
        .catch(reject);
    });
  }

  maxAssets(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.maxAssets().call()
        .then((maxAssets) => Number(maxAssets))
        .then(resolve)
        .catch(reject);
    });
  }

  enterMarkets(marketAddress, from = '') {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.enterMarkets([marketAddress]), from)
        .then(() => {
          return this.getAssetsIn(from);
        }).then((assets) => {
          let index = assets.findIndex((item) => item == marketAddress);
          if (index < 0) reject({
            err: 'enter fail'
          });
        })
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  exitMarket(marketAddress, from = '') {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.exitMarket(marketAddress), from).then(() => {
          return this.getAssetsIn(from);
        }).then((assets) => {
          let index = assets.findIndex((item) => item == marketAddress);
          if (index >= 0) reject({
            err: 'exit fail'
          });
        }).then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  claimComp(from = '', marketList) {
    return new Promise((resolve, reject) => {
      this.getMarketList().then((marketList) => {
          return send(this.instance.methods.claimComp(from), from)
        }).then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  getMarketsInfo(marketAddress) {
    return new Promise((resolve, reject) => {
      this.instance.methods.markets(marketAddress).call().then((market) => {
          return market;
        }).then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }


  getBaseTokenPrice() {
    return new Promise((resolve, reject) => {
      let _compAddress;
      this.instance.methods.getCompAddress().call().then((compAddress) => {
          _compAddress = compAddress;
          return this.instancePriceOracle
        }).then((instance) => {
          return instance.getUnderlyingPrice(_compAddress)
        }).then((price) => Number(price))
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

}

import AEtherContract from '@/contracts/AEther.json';
import InterestRateModel from '@/handlers/interestRateModel';
import {
  send,
  web3
} from '@/handlers';
import * as constants from '@/store/constants';
// import Web3 from 'web3';
import BN from 'bignumber.js';
import _ from 'lodash';
import envConfig from '@/common/config.js';
import {
  Contract,
  BigNumber
} from "ethers";

const blocksPerDay = 5 * 60 * 24;
const daysPerYear = 365;
const factor = 1e18;

/**
 * A blockchain transaction response.
 * @typedef {Object} TXResult
 */
/**
 * Market handler
 */
export default class AEther {
  /**
   * Market handler constructor
   * @param {string} address On chain `Market` deployed address.
   * @param {object} config of the network { chainId: WEB_SOCKETS_PROVIDER }
   * @return {Error}
   */
  constructor(address = '') {
    this.config = {
      [envConfig.VUE_APP_NETWORK_ID]: {
        httpProvider: envConfig.VUE_APP_HTTP_PROVIDER,
        wsProvider: envConfig.VUE_APP_WS_PROVIDER,
      },
    };
    this.instanceAddress = address; // TODO .toLowerCase();
    if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return new Error('Missing address');
    this.instance = new web3.eth.Contract(AEtherContract.abi, address);
    this.eventualWeb3WS = web3.eth.getChainId()
      .then((chainId) => new Web3(new Web3
        .providers.WebsocketProvider(this.config[chainId].wsProvider)))
      .catch(() => new Error('Something went wrong with the web3 instance over web sockets on Market'));
    this.eventualWeb3Http = web3.eth.getChainId()
      .then((chainId) => new Web3(new Web3
        .providers.HttpProvider(this.config[chainId].httpProvider)))
      .catch(() => new Error('Something went wrong with the web3 instance over http on Market'));
    this.instanceToken = {};

    this.instanceInterestRateModel = this.instance.methods.interestRateModel().call().then((
      InterestRateModelAddress) => new InterestRateModel(InterestRateModelAddress)).catch((err) => {
      console.log(err)
    });
  }

  /**
   * Market address
   * @return {string} this market instance address.
   */
  get address() {
    return this.instanceAddress;
  }

  /**
   * Market token
   * @return {Token} this market instance token.
   */
  get token() {
    return this.instanceToken;
  }

  get decimals() {
    return new Promise((resolve, reject) => {
      this.instance.methods.decimals().call()
        .then((decimals) => Number(decimals))
        .then(resolve)
        .catch(reject);
    });
  }

  get eventualSymbol() {
    return new Promise((resolve, reject) => {
      this.instance.methods.symbol().call()
        .then(resolve)
        .catch(reject);
    });
  }


  getBalance(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.balanceOf(account).call()
        .then((balance) => Number(balance))
        .then(resolve)
        .catch(reject);
    });
  }

  getBorrowBalanceStored(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.borrowBalanceStored(account).call()
        .then((borrowBalanceStored) => Number(borrowBalanceStored))
        .then(resolve)
        .catch(reject);
    });
  }

  getExchangeRateStored() {
    return new Promise((resolve, reject) => {
      this.instance.methods.exchangeRateStored().call()
        .then((exchangeRateStored) => Number(exchangeRateStored))
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Returns an eventual controller address.
   * @return {Promise<string>} eventual registered controller address.
   */
  get getController() {
    return new Promise((resolve, reject) => {
      this.instance.methods.comptroller().call()
        .then(resolve)
        .catch(reject);
    });
  }

  get getReserveFactorMantissa() {
    return new Promise((resolve, reject) => {
      this.instance.methods.reserveFactorMantissa().call()
        // .then((reserveFactorMantissa) => Number(reserveFactorMantissa))
        .then(resolve)
        .catch(reject);
    });
  }


  get getTotalSupply() {
    return new Promise((resolve, reject) => {
      this.instance.methods.totalSupply().call()
        .then((totalSupply) => Number(totalSupply))
        .then(resolve)
        .catch(reject);
    });
  }

  get getTotalBorrows() {
    return new Promise((resolve, reject) => {
      this.instance.methods.totalBorrows().call()
        .then((totalBorrows) => Number(totalBorrows))
        .then(resolve)
        .catch(reject);
    });
  }

  get getTotalReserves() {
    return new Promise((resolve, reject) => {
      this.instance.methods.totalReserves().call()
        .then((totalReserves) => Number(totalReserves))
        .then(resolve)
        .catch(reject);
    });
  }

  get getCash() {
    return new Promise((resolve, reject) => {
      this.instance.methods.getCash().call()
        .then((cash) => Number(cash))
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Returns an eventual borrow rate, it varies depending on the total borrows
   * and cash of this market.
   * @return {Promise<number>} eventual market's borrow rate.
   */
  get getBorrowRate() {
    return new Promise((resolve, reject) => {
      this.instanceInterestRateModel
        .then((instanceInterestRateModel) => {
          return [
            instanceInterestRateModel,
            this.getTotalBorrows,
            this.getTotalReserves,
            this.getCash
          ]
        })
        .then((promises) => Promise.all(promises))
        .then(([
          instanceInterestRateModel,
          totalBorrows,
          totalReserves,
          cashes
        ]) => {
          return instanceInterestRateModel.getBorrowRate(cashes, totalBorrows, totalReserves);
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
  get getSupplyRate() {
    return new Promise((resolve, reject) => {
      let factor
      this.getReserveFactorMantissa
        .then((factor) => {
          return [
            this.instanceInterestRateModel,
            factor,
            this.getTotalBorrows,
            this.getTotalReserves,
            this.getCash
          ]
        })
        .then((promises) => Promise.all(promises))
        .then(([
          instanceInterestRateModel,
          factor,
          totalBorrows,
          totalReserves,
          cashes
        ]) => {
          return instanceInterestRateModel.getSupplyRate(cashes, totalBorrows, totalReserves,
            factor);
        })
        .then(resolve)
        .catch(reject);
    });
  }


  get utilizationRate() {
    return new Promise((resolve, reject) => {
      this.instanceInterestRateModel
        .then((instanceInterestRateModel) => {
          return [
            instanceInterestRateModel,
            this.getTotalBorrows,
            this.getTotalReserves,
            this.getCash
          ]
        })
        .then((promises) => Promise.all(promises))
        .then(([
          instanceInterestRateModel,
          totalBorrows,
          totalReserves,
          cashes
        ]) => {
          return instanceInterestRateModel.utilizationRate(cashes, totalBorrows, totalReserves);
        })
        .then(resolve)
        .catch(reject);
    });
  }
  /**
   * Returns an array with the blocks series according to the period
   * @param period string the period over the calculation is based
   * @return {Promise<[number]>} a promise to a result array block numbers
   */
  getPastBlockNumbers(period) {
    const pastBlockNumbers = [];
    let labelsPerPeriod;
    let blocksPerPeriod;
    return new Promise((resolve, reject) => {
      Promise.all([this.instanceInterestRateModel.getBlocksPerYear(), this.instance.methods
          .accrualBlockNumber(), this.instance.methods.getBlockNumber()
        ])
        .then(([blocksPerYear, deployBlock, currentBlockNumber]) => {
          switch (period) {
            case constants.PERIOD_DAY:
              labelsPerPeriod = 12;
              blocksPerPeriod = Math.floor(blocksPerYear / (365.25 * 12));
              break;
            case constants.PERIOD_WEEK:
              labelsPerPeriod = 7;
              blocksPerPeriod = Math.floor(blocksPerYear / 365.25);
              break;
            case constants.PERIOD_MONTH:
              labelsPerPeriod = 15;
              blocksPerPeriod = Math.floor((blocksPerYear * 2) / (365.25));
              break;
            case constants.PERIOD_YEAR:
              labelsPerPeriod = 12;
              blocksPerPeriod = Math.floor((blocksPerYear) / (12));
              break;
            default:
              labelsPerPeriod = 7;
              blocksPerPeriod = Math.floor(blocksPerYear / 365.25);
          }
          _.range(labelsPerPeriod).forEach((i) => {
            const pastBlockNumber = currentBlockNumber - (blocksPerPeriod * i) >=
              deployBlock ?
              currentBlockNumber - (blocksPerPeriod * i) : deployBlock;
            pastBlockNumbers.push(pastBlockNumber);
          });
          resolve(pastBlockNumbers);
        })
        .catch(reject);
    });
  }

  /**
   * Returns an two dimensional array with the market balance through a given period
   * @param {string} period over the balances ('day', 'week', 'month', 'year')
   * @return {Promise<[[object, number, number]]>} an array of arrays with the timestamp,
   * the total supply value and total borrow value of this market.
   */
  getOverallBalance(period = constants.PERIOD_WEEK) {
    return new Promise((resolve, reject) => {
      this.getPastBlockNumbers(period)
        .then((pastBlockNumbers) => {
          const pastMarketBalancesPromises = Promise.all(pastBlockNumbers
            .map((blockNumber) => {
              const market = new Market(this.address);
              market.setDefaultBlock(blockNumber);
              return Promise.all([
                market.eventualUpdatedTotalSupply,
                market.eventualUpdatedTotalBorrows,
              ]);
            }));
          const pastBlocksPromise = Promise.all(pastBlockNumbers
            .map((blockNumber) => web3.eth.getBlock(blockNumber)));
          return Promise.all([pastMarketBalancesPromises, pastBlocksPromise]);
        })
        .then(([pastMarketBalances, pastBlocks]) => {
          const overallBalances = pastMarketBalances
            .map(([updatedTotalSupply, updatedTotalBorrow], idx) => {
              const time = new Date(pastBlocks[idx].timestamp * 1000);
              return [time, updatedTotalSupply, updatedTotalBorrow];
            });
          resolve(overallBalances);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  /**
   * Asks the user permission to approve transactions on this market's token on their behalf, and
   * then supplies the specified amount to be transferred into this market.
   * @param {number} amount of this market's token to be transferred.
   * @param {string=} from if specified executes the transaction using this account.
   * @return {Promise<TXResult>}
   */
  supply(amount, from = '') {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.mint(), from, amount)
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  /**
   * Borrows the specified amount from this market. May fail if no collateral has been supplied.
   * onto another market.
   * @param {number} amount of this market's token to be borrowed.
   * @param {string=} from if specified executes the transaction using this account.
   * @return {Promise<TXResult>}
   */
  borrow(amount, from = '') {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.borrow(amount), from)
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  /**
   * Pays off the specified amount from an existing debt in this market.
   * May fail if there is no debt to be paid or if the user doesn't have enough
   * tokens to pay the amount entered.
   * @param {number} amount of the debt of this market's token to be paid.
   * @param {string=} from if specified executes the transaction using this account.
   * @return {Promise<TXResult>}
   */
  repayBorrow(amount, from = '') {
    return new Promise((resolve, reject) => {
      send(this.instance.methods.repayBorrow(), from,amount)
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  /**
   * Withdraws the specified amount of tokens from this market.
   * It may fail if the given amount exceeds the market's cash or if
   * the given amount it's bigger than the total amount supplied by
   * the user.
   * @param {number} amount of this market's token to be redeem.
   * @param {string=} from if specified executes the transaction using this account.
   * @return {Promise<TXResult>}
   */
  redeem(amount, from = '') {
    console.log('redeem',amount)
    return new Promise((resolve, reject) => {
      send(this.instance.methods.redeemUnderlying(amount), from)
        .then(resolve)
        .catch((err) => {
          console.log(err);
          reject(new Error('There was an error redeeming your tokens'));
        });
    });
  }

  /**
   * Returns the current supplied and borrowed values for a given account.
   * @param {string} account
   * @return {Promise<AccountValues>}
   */
  getAccountSnapshot(account) {
    return new Promise((resolve, reject) => {
      this.instance.methods.getAccountSnapshot(account).call()
        .then(({
          error,
          ATokenBalance,
          borrowBalance,
          exchangeRateMantissa
        }) => ({
          supplyValue: Number(ATokenBalance),
          borrowValue: Number(borrowBalance),
        }))
        .then(resolve)
        .catch(reject);
    });
  }

  getBlocksPerYear() {
    return new Promise((resolve, reject) => {
      this.instanceInterestRateModel
        .then((instanceInterestRateModel) => {
          return instanceInterestRateModel.getBlocksPerYear();
        }).then(resolve).catch(reject);
    });

  }


  supplyRateAPY() {
    return new Promise((resolve, reject) => {
      Promise.all([this.instance.methods.supplyRatePerBlock().call(), this.getBlocksPerYear()])
        .then(([supplyRatePerBlock, blocksPerYear]) => {
          supplyRatePerBlock = Number(supplyRatePerBlock) / factor;
          return ((Number(supplyRatePerBlock) * blocksPerYear / 365 + 1) ** (daysPerYear - 1) - 1) *
            100;
        })
        .then(resolve)
        .catch(reject);
    });
  }

  borrowRateAPY() {
    return new Promise((resolve, reject) => {
      Promise.all([this.instance.methods.borrowRatePerBlock().call(), this.getBlocksPerYear()])
        .then(([borrowRatePerBlock, blocksPerYear]) => {
          borrowRatePerBlock = Number(borrowRatePerBlock) / factor;
          return ((Number(borrowRatePerBlock) * blocksPerYear / 365 + 1) ** (daysPerYear - 1) - 1) *
            100;
        })
        .then(resolve)
        .catch(reject);
    });
  }

}

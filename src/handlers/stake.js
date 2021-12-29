import Token from '@/handlers/token';
import StakeBasePool from '@/contracts/StakeBasePool.json';
let BigNumber = require('bignumber.js')
import {
  send,
  web3
} from '@/handlers';
import * as constants from '@/store/constants';


export default class BaseStake {
  constructor(address = '') {
  	this.instanceAddress = address; // TODO .toLowerCase();
    let isAddress = web3.utils.isAddress(this.address);
    if (!isAddress) return console.log('Error address');
    if (!this.address.match(/0x[a-fA-F0-9]{40}/)) return console.log('Missing address');
  	this.instance = new web3.eth.Contract(StakeBasePool.abi, address);
    this.instanceToken = this.instance.methods.stakeToken().call().then((tokenAddress) => new Token(tokenAddress)).catch((err)=> {console.log(err)});
  }

  get address() {
    return this.instanceAddress;
  }

  get token() {
    return this.instanceToken;
  }

  rewardRate(){
    return new Promise((resolve, reject) => {
      this.instance.methods.rewardRate().call()
        .then((rewardRate) => Number(rewardRate))
        .then(resolve)
        .catch(reject);
    });
  }

  getBalanceOf(account){
     return new Promise((resolve, reject) => {
       this.instance.methods.balanceOf(account).call()
         .then((balance) => Number(balance))
         .then(resolve)
         .catch(reject);
     });
   }

   getTotalSupply(){
     return new Promise((resolve, reject) => {
       this.instance.methods.totalSupply().call()
         .then((totalSupply) => Number(totalSupply))
         .then(resolve)
         .catch(reject);
     });
   }

   stake(amount, from = '') {
     return new Promise((resolve, reject) => {
       var _token;
       this.instanceToken.then((token) => {
           _token = token;
           return token.allowance(this.instanceAddress, from)
         }).then((allowance) => {
           allowance = Number(allowance);
           if (allowance < amount) {
             return _token.approve(this.instanceAddress,"100000000000000000000000000",from)
           }
         }).then(() =>
           send(this.instance.methods.stake(amount))
         )
         .then(resolve)
         .catch((err) => {
           console.log(err);
           reject(err);
         });
     });
   }

   withdraw(amount,account){
     return new Promise((resolve, reject) => {
       send(this.instance.methods.withdraw(amount))
         .then(resolve)
         .catch(reject);
     });
   }
   exit(account){
     return new Promise((resolve, reject) => {
       send(this.instance.methods.exit(account))
         .then(resolve)
         .catch(reject);
     });
   }
}

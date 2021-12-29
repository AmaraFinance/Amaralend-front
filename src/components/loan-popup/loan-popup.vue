<template>
  <div>
    <w-popup class="loan-popup" :dialogTitle="dialogTitle" :dialogVisible="dialogVisible" @handleClose="handleClose"
      v-if="marketInfo">
      <div class="logoBox">
        <div class="d-flex flex-column a-center">
          <img :src="marketInfo && marketInfo.assets_logo" style="width: 80px;" class="logo">
          <span class="coin">{{marketInfo.symbol}}</span>
        </div>
        <!-- <div class="coinSelect">
           <span>BTC</span>
           <i class="el-icon-arrow-down ml-2"></i>
         </div> -->
      </div>
      <div class="tabsBox">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('list.deposit')" name="1" v-if="showDepositModel"></el-tab-pane>
          <el-tab-pane :label="$t('list.withdraw')" name="2" v-if="showDepositModel"></el-tab-pane>
          <el-tab-pane :label="$t('list.borrow')" name="3" v-if="!showDepositModel"></el-tab-pane>
          <el-tab-pane :label="$t('list.repay')" name="4" v-if="!showDepositModel"></el-tab-pane>
        </el-tabs>
        <div class="loanInfo">
          <div class="inputBox">
            <el-input v-model="loanIptValue"
              :placeholder="$t('common.enterAmount') +loadModels[activeName - 1] + $t('common.amount')">
            </el-input>
            <div class="maxBtn" @click="maxbuttonAction">
              <span v-if="activeName == '1' || activeName == '4'">MAX</span>
              <span v-else>Safe Max</span>
            </div>
          </div>
          <div class="infoItem font-sm14 mt-15">
            <span>{{$t('list.loanLimit')}}：${{$tools.toThousands(ATokenInfo.borrowLimitWithPrice)}}</span>
            <span>{{$t('list.balance')}}: <span
                class="text-primary">{{asDouble(marketInfo.balance,marketInfo.decimals)}}</span>
              {{marketInfo.symbol}}</span>
          </div>
          <div class="infoItem  mt-3">
            <span>{{$t('list.loanUsed')}}：{{ATokenInfo.AccountHealth}}%</span>
          </div>
          <div class="sliderBox">
            <div class="dot" style="background-color:#FF00F2;"></div>
            <el-slider class="el-slider" :value="Number(ATokenInfo.AccountHealth)" disabled :show-tooltip="false">
            </el-slider>
            <!-- //<el-slider class="el-slider"  v-model="loanSlidervalue"   @change="onSliderIpt" ></el-slider> -->
            <div class="dot"></div>
          </div>
          <div class="infoItem mt-3" v-if="activeName == '2' || activeName == '3'">
            <span>{{$t('list.marketAvailable')}}：</span>
            <span>{{asDouble(marketInfo.available,marketInfo.decimals)}}{{marketInfo.symbol}}</span>
          </div>
          <div class="infoItem mt-3" v-if="activeName == '1' || activeName == '2'">
            <span>{{marketInfo.symbol}} {{$t('list.deposited')}}：</span>
            <span>{{(marketInfo.supplyValue)}}{{marketInfo.symbol}}</span>
          </div>
          <div class="infoItem mt-3" v-if="activeName != '4'">
            <span>{{Number(activeName) < 3 ? $t('list.deposit'): $t('list.borrow')}} APY:</span>
            <span>{{ Number(activeName) < 3 ? Number(marketInfo.supplyRate).toFixed(2) + "%":Number(marketInfo.borrowRate).toFixed(2) + "%"}}</span>
          </div>
          <div class="infoItem mt-3" v-if="activeName != '4'">
            <span>{{$t('list.distributionAPY')}}:</span>
            <span>{{showDepositModel ?  Number(marketInfo.comSupplyRate).toFixed(2) + "%" : Number(marketInfo.comBorrowRate).toFixed(2) + "%"}}</span>
          </div>
          <div class="infoItem mt-3" v-if="activeName == '4'">
            <span>{{marketInfo.symbol}} {{$t('list.borrowed')}}:</span>
            <span>{{ asDouble(marketInfo.borrowOf,marketInfo.decimals)}}{{marketInfo.symbol}} </span>
          </div>
          <div class="infoItem mt-3" v-if="activeName == '4'">
            <span>{{$t('list.totalBorrowed')}}:</span>
            <span>${{ Number(ATokenInfo.totalBorrowed).toFixed(4)}} </span>
          </div>
          <div class="submitBtnBox">
            <el-button class="el-button-submit" @click="applyAction" :loading="isLoading" :disabled="buttonDisabled">
              {{loadModels[activeName - 1]}}</el-button>
          </div>
          <div class="tipsBox" v-if="activeName == '4'">
            <img src="../../assets/images/tips.png" class="tipsImg">
            <span class="tipsTxt">{{$t('list.note')}}</span>
          </div>
        </div>
      </div>
    </w-popup>
  </div>
</template>


<script>
  import {
    mapState,
  } from "vuex";
  const BigNumber = require('bignumber.js');
  import {
    web3
  } from "@/handlers";
  import wPopup from '@/components/w-popup/w-popup.vue';
  export default {
    data() {
      return {
        activeName: '1',
        loanSlidervalue: 0,
        loanIptValue: "",
        loadModels: ['Deposit', 'Withdraw', 'Borrow', 'Repay'],
        isLoading: false,
        buttonDisabled: true,
        currentModel: ''
      }
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
        language: (state) => state.Session.language,
      }),
      contractAmount() {
        let loanIptValue = this.$tools.safeMul(this.loanIptValue, Math.pow(10, this.marketInfo.decimals || 18))
        let amount = this.$tools.asDouble(loanIptValue, 0);
        return amount;
      },
      marketInfo() {
        if (this.ATokenInfo) {
          return this.ATokenInfo.marketInfo;
        }
      },
      totalBorrowedWithMantisa() {
        if (this.ATokenInfo) {
          return this.ATokenInfo.totalBorrowedWithMantisa;
        }
      },
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      dialogTitle: {
        type: String,
        default: ''
      },
      showDepositModel: {
        type: Boolean,
        default: true
      },
      ATokenInfo: {
        type: Object,
      },

    },
    components: {
      wPopup
    },
    watch: {
      dialogVisible() {
        if (!this.showDepositModel) {
          if (this.ATokenInfo.tabKey) {
            this.activeName = this.ATokenInfo.tabKey
          } else {
            this.activeName = '3'
          }
        } else {
          if (this.ATokenInfo.tabKey) {
            this.activeName = this.ATokenInfo.tabKey
          } else {
            this.activeName = '1'
          }
        }
      },
      loanIptValue(newVal, oldVal) {
        this.getValues();
      },
      language(newValue, old) {
        this.loadModels = [this.$t('list.deposit'), this.$t('list.withdraw'), this.$t('list.borrow'), this.$t(
          'list.repay')]
        this.currentModel = this.loadModels[this.activeName - 1]
      },
      activeName(newVal, old) {
        this.currentModel = this.loadModels[newVal - 1]
      }
    },
    mounted() {
      this.loadModels = [this.$t('list.deposit'), this.$t('list.withdraw'), this.$t('list.borrow'), this.$t(
        'list.repay')]
      this.currentModel = this.loadModels[this.activeName - 1]
    },
    methods: {
      applyAction() {
        this.isLoading = true;
        switch (this.activeName) {
          case '1':
            this.SupplyAction();
            break;
          case '2':
            this.WithdrawAction();
            break;
          case '3':
            this.BorrowAction();
            break;
          case '4':
            this.RepayAction();
            break;
        }
      },
      maxbuttonAction() {
        switch (this.activeName) {
          case '1':
            this.loanIptValue = this.asDouble(this.marketInfo.balance, this.marketInfo.decimals);
            break;
          case '2':
            this.loanIptValue = this.asDouble(this.getMaxSafeWithdrawAllowed(), this.marketInfo.decimals);
            break;
          case '3':
            this.loanIptValue = this.asDouble(this.getMaxSafeBorrowAllowed(), this.marketInfo.decimals);
            break;
          case '4':
            let borrowOf = this.asDouble(this.marketInfo.borrowOf, this.marketInfo.decimals);
            let balance = this.asDouble(this.marketInfo.balance, this.marketInfo.decimals);
            this.loanIptValue = this.asDouble(borrowOf > balance ? this.marketInfo.balance : this.marketInfo.borrowOf,
              this.marketInfo.decimals);
            break;
        }
      },
      getMaxSafeWithdrawAllowed() {
        let maxAvaliable;
        if ((this.totalBorrowedWithMantisa == 0) || !this.marketInfo.collateral) {
          maxAvaliable = this.marketInfo.supplyBalanceInfo < this.marketInfo.available ? this.marketInfo
            .supplyBalanceInfo : this.marketInfo.available;
          return maxAvaliable;
        }
        maxAvaliable = (this.ATokenInfo.totalSupplied - (this.ATokenInfo.totalBorrowed / (this.marketInfo
            .collateralFactor / Math.pow(10, 18)) /
          0.85));
        if (maxAvaliable < 0) {
          maxAvaliable = 0;
        }
        let maxSafeAvaliable = (maxAvaliable / this.marketInfo.price) * Math.pow(10, 18 + 18 - this.marketInfo
          .decimals) * Math.pow(10, this.marketInfo.decimals);
        maxSafeAvaliable =
          maxSafeAvaliable > this.marketInfo.supplyBalanceInfo ?
          this.marketInfo.supplyBalanceInfo :
          maxSafeAvaliable;

        return maxSafeAvaliable < this.marketInfo.available ?
          maxSafeAvaliable :
          this.marketInfo.available;
      },
      getMaxSafeBorrowAllowed() {
        let allowed = (((Number(this.marketInfo.liquidity) + Number(this.totalBorrowedWithMantisa)) * 0.85 -
          Number(this.totalBorrowedWithMantisa)) * Math.pow(10, 18)) / this.marketInfo.price;
        if (allowed < 0) {
          allowed = 0;
        }
        return allowed >= this.marketInfo.available ? this.marketInfo.available : allowed;
      },
      getMaxBorrowAllowed() {
        let allowed = (this.marketInfo.liquidity * Math.pow(10, 18)) / this.marketInfo.price;
        if (allowed < 0) {
          allowed = 0;
        }
        return allowed >= this.marketInfo.available ? this.marketInfo.available : allowed;
      },
      getMaxWithdrawAllowed() {
        let maxAvaliable;
        if ((this.totalBorrowedWithMantisa == 0) || !this.marketInfo.collateral) {
          maxAvaliable = this.marketInfo.supplyBalanceInfo < this.marketInfo.available ? this.marketInfo
            .supplyBalanceInfo : this.marketInfo.available;
          return maxAvaliable;
        }
        maxAvaliable =
          (this.marketInfo.liquidity * Math.pow(10, 18)) /
          this.marketInfo.collateralFactor;
        if (maxAvaliable < 0) {
          maxAvaliable = 0;
        }
        let maxSafeAvaliable = (maxAvaliable / this.marketInfo.price) * Math.pow(10, 18);
        maxSafeAvaliable = maxSafeAvaliable > this.marketInfo.supplyBalanceInfo ?
          this.marketInfo.supplyBalanceInfo :
          maxSafeAvaliable;
        return maxSafeAvaliable < this.marketInfo.available ?
          maxSafeAvaliable :
          this.marketInfo.available;
      },
      asDouble(value, factor_, decimals_) {
        let decimals = decimals_ || this.marketInfo.decimals;
        return this.$tools.asDouble(value, factor_ || 4, decimals);
      },
      async getValues() {
        let loanIptValue = Number(this.loanIptValue);
        switch (this.activeName) {
          case '1':
            let amount1 = this.asDouble(this.marketInfo.balance, this.marketInfo.decimals)
            if (loanIptValue > 0 && loanIptValue <= amount1) {
              this.buttonDisabled = false;
            } else {
              this.buttonDisabled = true;
            }
            break;
          case '2':
            let amount2 = this.asDouble(this.getMaxWithdrawAllowed(), this.marketInfo.decimals);
            if (loanIptValue > 0 && loanIptValue <= Number(amount2)) {
              this.buttonDisabled = false;
            } else {
              this.buttonDisabled = true;
            }
            break;
          case '3':
            let amout3 = this.asDouble(this.getMaxBorrowAllowed(), this.marketInfo.decimals);
            if (loanIptValue > 0 && loanIptValue <= Number(amout3)) {
              this.buttonDisabled = false;
            } else {
              this.buttonDisabled = true;
            }
            break;
          case '4':
            let amout4 = this.asDouble(this.marketInfo.borrowOf > this.marketInfo.balance ? this.marketInfo.balance :
              this.marketInfo.borrowOf, this.marketInfo.decimals);
            if (loanIptValue > 0 && loanIptValue <= Number(amout4)) {
              this.buttonDisabled = false;
            } else {
              this.buttonDisabled = true;
            }
            break;
        }
      },
      SupplyAction() {
        this.ATokenInfo.market.supply(this.contractAmount, this.account)
          .then((res) => {
            this.clear();
            this.$message({
              message: this.currentModel + this.$t('common.success'),
              type: "success",
            });
            this.$emit('reload');
          })
          .catch((err) => {
            console.log(err)
            this.clear();
            this.$message.error(this.currentModel + this.$t('common.fail'));
          });
      },
      WithdrawAction() {
        this.ATokenInfo.market
          .redeem(this.contractAmount, this.account)
          .then((res) => {
            this.clear();
            this.$message({
              message: this.currentModel + this.$t('common.success'),
              type: "success",
            });
            this.$emit('reload');
          })
          .catch(() => {
            this.clear();
            this.$message.error(this.currentModel + this.$t('common.fail'));
          });
      },
      BorrowAction() {
        this.ATokenInfo.market
          .borrow(this.contractAmount, this.account)
          .then((res) => {
            this.clear();
            this.$message({
              message: this.currentModel + this.$t('common.success'),
              type: "success",
            });
            this.$emit('reload');
          })
          .catch(() => {
            this.clear();
            this.$message.error(this.currentModel + this.$t('common.fail'));
          });
      },
      RepayAction() {
        let repayAmount;
        let maxAmount = this.asDouble(this.marketInfo.borrowOf, this.marketInfo.decimals);
        if (this.loanIptValue >= maxAmount && this.asDouble(this.marketInfo.balance, this.marketInfo.decimals) !=
          maxAmount && this.marketInfo.address != this.$envConfig.VUE_APlatformToken) {
          repayAmount = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
        } else {
          repayAmount = this.contractAmount;
        }
        this.ATokenInfo.market
          .repayBorrow(repayAmount, this.account)
          .then((res) => {
            this.clear();
            this.$message({
              message: this.currentModel + this.$t('common.success'),
              type: "success",
            });
            this.$emit('reload');
          })
          .catch(() => {
            this.clear();
            this.$message.error(this.currentModel + this.$t('common.fail'));
          });
      },
      handleClick(tab, event) {
        this.loanIptValue = ''
      },
      handleClose() {
        //this.activeName = '1'
        this.loanIptValue = ''
        this.$emit('handleClose')
      },
      clear() {
        this.isLoading = false;
        this.loanIptValue = '';
      },
      // onSliderIpt(val) {
      //   let amout;
      //   switch (this.activeName) {
      //     case '1':
      //       this.loanIptValue = this.$tools.asDouble((val / 100) * this.marketInfo.balance, 4,this.marketInfo.decimals);
      //       break;
      //     case '2':
      //       amout = this.getMaxWithdrawAllowed();
      //       this.loanIptValue = this.$tools.asDouble((val / 100) * amout, 4,this.marketInfo.decimals);
      //       break;
      //     case '3':
      //       amout = this.getMaxBorrowAllowed();
      //       this.loanIptValue = this.$tools.asDouble((val / 100) * amout,4,this.marketInfo.decimals);
      //       break;
      //     case '4':
      //       this.loanIptValue = this.$tools.asDouble( (val / 100) * this.marketInfo.borrowOf,4,this.marketInfo.decimals );
      //       break;
      //   }
      // },
    }
  }
</script>

<style lang="scss">
  .loan-popup {
    .logoBox {
      display: flex;
      justify-content: center;

      .logo {
        width: 80px;
      }

      .coin {
        margin-top: 10px;
        font-size: 22px;
        font-weight: 600;
        color: #FFFFFF;
      }

      .coinSelect {
        margin: 20px 0 0 98px;
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 118px;
        height: 40px;
        background: rgba(29, 20, 67, 0.6);
        box-shadow: 1px 1px 6px 0px rgba(255, 255, 255, 0.7);
        border-radius: 10px;
        font-size: 14px;
        color: #FFFFFF;
        font-weight: 400;
      }
    }

    .tabsBox {
      .el-tabs__nav-wrap::after {
        background-color: transparent;
      }

      .el-tabs__item {
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.5);
      }

      .el-tabs__item.is-active {
        color: #FF00F2;
      }

      .el-tabs__active-bar {
        background-color: #FF00F2;
      }

      .loanInfo {
        margin-top: 30px;

        .inputBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 5px;
          box-sizing: border-box;
          width: 100%;
          height: 70px;
          background: #504988;
          box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
          border-radius: 10px;

          .el-input {
            width: 60%;

            .el-input__inner {
              border: none;
              background-color: transparent;
              font-size: 20px;
              font-weight: 400;
              color: #F802EE;

              &::placeholder {
                font-size: 14px;
              }
            }

          }

          .maxBtn {
            width: 120px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(180deg, #C557E0 0%, #922CBD 100%);
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            color: #FFFFFF;
          }
        }

        .submitBtnBox {
          margin-top: 40px;
          width: 100%;

          .el-button-submit {
            width: 100%;
            height: 69px;
            background: linear-gradient(160deg, #DC19C1 0%, #121FF0 100%);
            //box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5), 2px 2px 20px 0px rgba(255, 255, 255, 0.6);
            border-radius: 10px;
            font-size: 20px;
            font-weight: 500;
            color: #FFFFFF;
          }

          .is-disabled {
            background: rgba(255, 255, 255, 0.3);
          }
        }

        .tipsBox {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          .tipsImg {
            width: 16px;
          }

          .tipsTxt {
            margin-left: 16px;
            font-size: 10px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.5);
            line-height: 24px;
          }
        }

        .infoItem {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 400;
          color: #FFFFFF;
        }

        .sliderBox {
          display: flex;
          align-items: center;
          margin-top: 26px;

          .dot {
            width: 5px;
            height: 11px;
            border-radius: 2px;
            background: #F0F0F2;
          }

          .el-slider {
            margin: 0 5px;
            width: 100%;
          }

          .el-slider__bar {
            background: linear-gradient(270deg, #FF00FA 0%, #2800FF 100%);
            box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
          }

          .el-slider__button {
            border: none;
            background: linear-gradient(90deg, #003EFF 0%, #FF00CB 100%);
            box-shadow: 1px 2px 8px 0px rgba(0, 0, 0, 0.2), 0px 1px 3px 0px rgba(255, 255, 255, 0.8);
          }

          .el-slider__runway {
            height: 5px;
            background-color: rgba(240, 240, 242, 0.2);
          }

        }
      }
    }
  }
</style>

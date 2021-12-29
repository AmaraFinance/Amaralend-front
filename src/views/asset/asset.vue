<template>
  <div>
    <div class="assetWrap">
      <div class="tab_box account_tab">
        <span>{{$t('assets.myAccount')}}</span>
      </div>
      <div class="account_box">
        <div class="account_item">
          <img src="../../assets/images/balance-deposit.png" class="balanceImg">
          <div class="balanceInfo">
            <span class="info">{{$t('assets.depositBalance')}}</span>
            <span class="number">${{$tools.toThousands(totalSupplied,2)}}</span>
          </div>
        </div>
        <div class="account_item">
          <img src="../../assets/images/balance-borrow.png" class="balanceImg">
          <div class="balanceInfo">
            <span class="info">{{$t('assets.borrowBalance')}}</span>
            <span class="number">${{$tools.toThousands(totalBorrowed)}}</span>
          </div>
        </div>
        <div class="account_item">
          <img src="../../assets/images/used-ratio.png" class="balanceImg">
          <div class="balanceInfo balanceInfo_ratio">
            <div class="d-flex j-sb w-100">
              <span class="info">{{$t('assets.usedRatio')}}</span>
              <span class="ratio">{{AccountHealth}}%</span>
            </div>
            <el-slider class="w-100" :value="Number(AccountHealth)" disabled :show-tooltip="false"></el-slider>
            <div class="d-flex j-sb  w-100">
              <span class="info">{{$t('assets.maximum')}}</span>
              <span class="info">${{$tools.toThousands(borrowLimitWithPrice)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="myMarkets">
      <div class="titleBox">
        <div class="item" :class="{'bg-deposit': marketType == 'Deposit'}" @click="switchList('Deposit')">
          <span>{{$t('assets.myDeposit')}}</span>
        </div>
        <div class="item" :class="{'bg-borrow': marketType == 'Borrow'}" @click="switchList('Borrow')">
          <span>{{$t('assets.myBorrow')}}</span>
        </div>
        <div class="item_selected" :style="{'left': marketType == 'Deposit'? 0 : 140 +'px'}"></div>
      </div>
      <div class="tipsBox">
        <img src="../../assets/images/tips.png" class="tipImg">
        <span class="tipTxt">
          {{$t('list.importantNote')}}
        </span>
      </div>
      <div class="table_row_header blueBg_head" :class="{'orangeBg_head':marketType == 'Borrow'}">
        <span class="pl-2 box-s-box" style="width: 16%;">{{$t('list.assets')}}</span>
        <span style="width: 16%;">{{marketType == 'Deposit'?  $t('list.depositAPY') : $t('list.borrowAPY')}}</span>
        <span
          style="width: 16%;">{{marketType == 'Deposit'?   $t('list.depositAmount') : $t('list.borrowAmount') }}</span>
        <span style="width: 16%;">{{$t('list.myWalletBalance')}}</span>
        <div class="d-flex a-center" style="width: 16%;" v-if="marketType == 'Deposit'">
          <span>{{$t('list.collateral')}}</span>
          <el-tooltip style="width: 12%;" effect="light" :content="$t('common.toolTip2')" placement="top-start">
            <div slot="content">{{$t('common.toolTip3Title')}}<br />{{$t('common.toolTip3Content')}}</div>
            <img src="../../assets/images/question.png" class="question">
          </el-tooltip>
        </div>
        <span style="width: 20%;">{{$t('list.action')}}</span>
      </div>
      <div class="table_row_body">
        <div class="table_row_item blueBg_row" :class="{'orangeBg_row':marketType == 'Borrow'}"
          v-for="(item,index) in marketType=='Deposit' ? depositMarkets : borrowMarkets" :key="index">
          <div class="table_row_assets" style="width: 16%;">
            <img :src="item.assets_logo" class="coinLogo">
            <div class="coinInfo">
              <span>{{item.symbol}}</span>
              <span class="tokensubTxt">{{item.name}}</span>
            </div>
          </div>
          <div class="" style="width: 16%;text-align: left;">
            <span>{{marketType == 'Deposit'? item.suppliedRate : item.borrowedRate}}</span>
          </div>
          <div class="" style="width: 16%;text-align: left;">
            <span>{{ marketType == 'Deposit'? $tools.asDouble(item.supplyBalanceInfo,6,item.decimals): $tools.asDouble(item.borrowOf,6,item.decimals)}}</span>
          </div>
          <div class="" style="width: 16%;text-align: left;">
            <span>{{$tools.asDouble(item.balance,6,item.decimals)}}</span>
          </div>
          <div class="" style="width: 16%;text-align: left;" v-if="marketType == 'Deposit'">
            <div class="el-switch" @click="showCollateral(item,index)" :class="{ 'is-checked': item.collateral }">
              <span class="el-switch__core" style="width: 40px"></span>
            </div>
          </div>
          <div class="table_row_action" style="width: 18%;">
            <el-button class="btn btn_deposit" :disabled="marketType == 'Deposit' && item.mintPaused"
              @click="showLoan(item,index)">{{marketType == 'Deposit' ?  $t('list.deposit') : $t('list.borrow')}}
            </el-button>
            <el-button class="btn btn_borrow" :disabled="marketType == 'Borrow' && item.borrowPaused"
              @click="showLoan(item,index,marketType == 'Deposit' ? '2':'4')">
              {{marketType == 'Deposit' ?  $t('list.withdraw') : $t('list.repay')}}</el-button>
          </div>
        </div>
      </div>
      <loan-popup :dialogVisible="loanDialogVisible" :showDepositModel="showDepositModel" :ATokenInfo="ATokenInfo"
        @reload="reload()" @handleClose="handleLoanClose"></loan-popup>
      <collateral-popup :dialogVisible="collateralDialogVisible" :dialogTitle="$t('list.collateral')"
        :collateralInfo="collateralInfo" @optFinished="optFinished" @handleClose="handleCollateralClose">
      </collateral-popup>
    </div>
  </div>
</template>

<script>
  import {
    mapState,
  } from "vuex";
  const BigNumber = require('bignumber.js');
  import loanPopup from '@/components/loan-popup/loan-popup.vue';
  import collateralPopup from '@/components/collateral-popup/collateral-popup.vue';
  export default {
    data() {
      return {
        ATokenInfo: {},
        collateralInfo: {},
        showDepositModel: true,
        loanDialogVisible: false,
        collateralDialogVisible: false,
        AccountHealth: 0,
        depositMarkets: [],
        borrowMarkets: [],
        percentage: 0,
        totalSupplied: 0,
        totalBorrowed: 0,
        borrowLimitWithPrice: 0,
        marketType: 'Deposit',
        allMarketList: [
          {
            AToken: "ABTC",
            address: "0xDf50B7Ff7DDdfC2808a0f1c51D74cB34DAfb4A6C",
            symbol: "BTC",
            name: "BitCoin",
            assets_logo: require("../../assets/coins/btc.png"),
            supplied: 0,
            supplied_equalTo: 0
          },
          {
            AToken: "AMOVR",
            address: "0x0A55B26f2f69AE1E8eD47c242DDc34D3AB993ddE",
            symbol: "MOVR",
            name: "MOONRIVER",
            assets_logo: require("../../assets/coins/moon.png"),
            supplied: 0,
            supplied_equalTo: 0
          }
        ],
      }
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
      }),
    },
    components: {
      loanPopup,
      collateralPopup
    },
    watch: {
      account: {
        handler() {
          if (this.account) {
            this.getAllMarketsInfo();
          }
        },
      },
    },
    created() {
      if (this.account) {
        this.getAllMarketsInfo();
      }
    },
    methods: {
      optFinished() {
        this.getAllMarketsInfo();
        this.collateralDialogVisible = false;
      },
      reload() {
        this.getAllMarketsInfo();
        this.loanDialogVisible = false;
      },
      handleLoanClose() {
        this.loanDialogVisible = !this.loanDialogVisible;
      },
      handleCollateralClose() {
        this.collateralDialogVisible = !this.collateralDialogVisible;
      },
      showCollateral(item, index) {
        let market = this.depositMarkets[index];
        let isCollateral = market.collateral;
        let collateralValue =
          (market.supplyBalanceInfoWithMantisa * market.collateralFactor) /
          Math.pow(10, 18) /
          Math.pow(10, 18);
        let changedWithPrice = !isCollateral ?
          Number(this.borrowLimitWithPrice) + collateralValue :
          Number(this.borrowLimitWithPrice) - collateralValue;
        this.borrowLimitWithPriceChange = this.$tools.asDouble(
          changedWithPrice > 0 ? changedWithPrice : 0,
          4
        );
        let change;
        if (changedWithPrice <= 0) {
          change = 0;
        } else {
          change = (Number(this.totalBorrowed) / Number(changedWithPrice))
        }
        if (change > 1) change = 1;
        this.AccountHealthChange = this.$tools.asDouble(change * Math.pow(10, 2), 4);
        let operateMarketText = isCollateral ? this.$t('common.close') : this.$t('common.allow');
        this.collateralInfo = {
          market: market,
          assets_logo: item.assets_logo,
          assets: item.assets,
          operateMarketText: operateMarketText,
          borrowLimitWithPrice: this.borrowLimitWithPrice,
          borrowLimitWithPriceChange: this.borrowLimitWithPriceChange,
          AccountHealth: this.AccountHealth,
          AccountHealthChange: this.AccountHealthChange
        }
        this.collateralDialogVisible = true
      },
      async showLoan(row, index, key) {
        this.marketType == 'Deposit' ? this.showDepositModel = true : this.showDepositModel = false;
        this.marketList =  await this.$unitroller.markets();
        var idx = this.marketList.findIndex(item => item.address == row.address)
        this.ATokenInfo = {
          marketInfo: row,
          market: this.marketList[idx],
          totalBorrowed: this.totalBorrowed,
          totalBorrowedWithMantisa: this.totalBorrowedWithMantisa,
          totalSupplied: this.totalSupplied,
          borrowLimitWithPrice: this.borrowLimitWithPrice,
          AccountHealth: this.AccountHealth,
        }
        if (key) {
          this.ATokenInfo['tabKey'] = key;
        }
        this.loanDialogVisible = true;
      },
      switchList(key) {
        this.marketType = key
      },
      getAllMarketsInfo() {
        let that = this;
        let asserts = [];
        this.depositMarkets = []
        this.borrowMarkets = []
        this.tableLoading = true;
        this.totalSupplied = 0;
        this.totalBorrowed = 0;
        this.totalBorrowedWithMantisa = 0;
        this.borrowLimitWithPrice = 0;
        let totalEarnings = 0;
        this.allMarketList.map((market, index) => {
          this.$AmaraLendLens.ATokenMetadata(market.address).then((ATokenMetadata) => {
            market.decimals = Number(ATokenMetadata['underlyingDecimals']);
            let decimals = market.decimals;
            let priceMantisa = Math.pow(10,18 + 18 - decimals);
            market.ATokenDecimals = Number(ATokenMetadata['ATokenDecimals']);
            market.totalSupply = (ATokenMetadata['totalSupply']);
            market.exchangeRateStored = (ATokenMetadata['exchangeRateStored']);
            market.marketPrice = (ATokenMetadata['underlyingPrice']);
            market.totoalBorrow = Number(ATokenMetadata['totalBorrows']);
            market.borrowRate = this.$tools.supplyRateAPY((ATokenMetadata['borrowRatePerBlock']));
            market.supplyRate = this.$tools.borrowRateAPY((ATokenMetadata['supplyRatePerBlock']));
            market.totalReservers = Number(ATokenMetadata['totalReserves']);
            market.cash = Number(ATokenMetadata['totalCash']);
            market.collateralFactorMantissa = Number(ATokenMetadata['collateralFactorMantissa']);
            if (market.totoalBorrow <= 0) {
              market.utilRate = 0;
            } else {
              let x = new BigNumber(market.cash).plus(new BigNumber(market.totoalBorrow))
              let res = new BigNumber(market.totoalBorrow).div(new BigNumber(x).minus(new BigNumber(market
                .totalReservers)))
              market.utilRate = res.dp(2).toNumber()
            }

            return [this.$AmaraLendLens.ATokenBalances(market.address, this.account), this
              .$unitroller.getAccountLiquidity(this.account), this.$Amara.getATokenMetadata(market
                .address), market
            ]
          }).then((promises) => Promise.all(promises)).then(async ([ATokenBalances, liquidity, ATokenMetadata,
            market
          ]) => {
            let balance = (ATokenBalances['tokenBalance']);
            let supplyOf = (ATokenBalances['balanceOf']);
            let borrowOf = (ATokenBalances['borrowBalanceCurrent']);
            let decimals = market.decimals;
            let priceMantisa = Math.pow(10,18 + 18 - decimals);

            this.price = market.marketPrice;
            let supplyValue = this.$tools.asDouble((supplyOf * market.exchangeRateStored) / Math.pow(10, 18),
              decimals, decimals);
            let marketAvaliable = Number(market.cash - market.totalReservers) < 0 ? 0 : Number(market.cash -
              market.totalReservers);

            var comSupplyRate = Number(Number(ATokenMetadata[1]) / Math.pow(10, 4));
            var comBorrowRate = Number(Number(ATokenMetadata[2]) / Math.pow(10, 4));
            var totalSupplyRate = market.supplyRate + comSupplyRate;
            var totalBorrowRate = market.borrowRate - comBorrowRate;

            let mySupplyWithPrice = this.$tools.asDouble((supplyOf * market.exchangeRateStored * market
              .marketPrice) / Math.pow(10, 18) / Math.pow(10, 18), 4, 6);
            let myBorrowWithPrice = this.$tools.asDouble((borrowOf * market.marketPrice) / Math.pow(10, 18),
              4, 6);
            let supplyOfValue = Number(supplyOf / Math.pow(10, decimals) * market.exchangeRateStored * Number(
              market.marketPrice /
              priceMantisa));
            market.borrowOf = borrowOf;
            market.comSupplyRate = comSupplyRate;
            market.comBorrowRate = comBorrowRate;
            market.supplyValue = supplyValue;
            market.liquidity = liquidity;
            market.price = market.marketPrice;
            market.iToken = supplyOf;
            market.suppliedRate = this.$tools.asDouble(totalSupplyRate, 2) + "%";
            market.supplied_equalTo = "=" + this.$tools.asDouble(market.supplyRate, 2) + "%" + " + " + this.$tools.asDouble(comSupplyRate, 2) + "%";
            market.borrowedRate = this.$tools.asDouble(totalBorrowRate, 2) + "%";
            market.borrowed_equalTo = "=" + this.$tools.asDouble(market.borrowRate, 2) + "%" + " - " + this.$tools.asDouble(comBorrowRate, 2) + "%";
            market.available = marketAvaliable;
            market.balance = balance;
            market.supplyBalanceInfo = (supplyOf * market.exchangeRateStored) / Math.pow(10, 18);
            market.supplyBalanceInfoWithMantisa = (supplyOf * market.exchangeRateStored * market.marketPrice) /
              Math.pow(10, 18) /
              Math.pow(10, 18);
            market.collateralFactor = market.collateralFactorMantissa;
            market.mintPaused = await this.$unitroller.mintGuardianPaused(market.address);
            market.borrowPaused = await this.$unitroller.borrowGuardianPaused(market.address);
            let assets = await this.$unitroller.getAssetsIn(this.account);
            if (assets.length && assets.findIndex((item) => item == market.address) >= 0) {
              market.collateral = true
            } else {
              market.collateral = false
            }

            if (!market.mintPaused || !market.borrowPaused) {
              if (market.collateral) {
                let supplyOfValue = Number(supplyOf / Math.pow(10, decimals) * market.exchangeRateStored * Number(
                  market.marketPrice / priceMantisa)) / Math.pow(10, 18);
                this.borrowLimitWithPrice += supplyOfValue * market.collateralFactorMantissa /
                  Math.pow(10, 18);
              }

              this.totalBorrowedWithMantisa += Number(
                borrowOf * Number(market.marketPrice / Math.pow(10, 18))
              );
              that.AccountHealth = this.totalBorrowedWithMantisa > 0 ? this.$tools.asDouble((this.totalBorrowedWithMantisa / (Number(liquidity) + this
                  .totalBorrowedWithMantisa)) * Math.pow(10, 2), 4) : "0.00";
              this.totalSupplied +=
                (((supplyOf / Math.pow(10, decimals)) *
                    market.exchangeRateStored) /
                  Math.pow(10, 18)) *
                Number(market.marketPrice / priceMantisa);

              this.totalBorrowed +=
                (borrowOf / Math.pow(10, decimals)) *
                Number(market.marketPrice / priceMantisa);
              // Hard
              if (borrowOf > 0) {
                this.borrowMarkets.push(market)
              }
              if (supplyOf > 0) {
                this.depositMarkets.push(market)
              }
            }
            if (borrowOf > 0 || supplyOf > 0) {
              let earning =
                mySupplyWithPrice * Number(market.supplyRate + comSupplyRate) -
                myBorrowWithPrice * Number(market.borrowRate - comBorrowRate);
              totalEarnings += (earning / 100);

              this.percentage = Number(
                this.$tools.asDouble(
                  (totalEarnings) / this.totalSupplied * Math.pow(10, 2),
                  2
                )
              );
            } else {
              this.percentage = this.percentage > 0 ? this.percentage : 0;
            }
          })
        });
      },

    }
  }
</script>

<style lang="scss">
  .myMarkets {
    margin-top: 40px;

    .table_row_header {
      margin-top: 20px;
      padding-left: 20px;
      box-sizing: border-box;
      width: 100%;
      height: 66px;
      display: flex;
      align-items: center;
      box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
      border-radius: 10px;

      //border: 2px solid rgba(255, 255, 255, 0.2);
      //filter: blur(10px);
      span {
        text-align: left;
        font-size: 15px;
        font-weight: 600;
      }

      .question {
        margin-left: 5px;
        width: 14px !important;
        cursor: pointer;
      }
    }

    .blueBg_head {
      background: linear-gradient(180deg, rgba(68, 227, 239, 0.35) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
      border: 2px solid;
      border-image: linear-gradient(163deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.2)) 2 2;
    }

    .orangeBg_head {
      background: linear-gradient(180deg, rgba(218, 127, 98, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
      border: 2px solid;
      border-image: linear-gradient(163deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.2)) 2 2;
    }

    .blueBg_row {
      background: linear-gradient(135deg, rgba(151, 217, 228, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
      border: 2px solid;
      border-image: linear-gradient(163deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.2)) 2 2;
    }

    .orangeBg_row {
      background: linear-gradient(135deg, rgba(234, 183, 170, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
      border-radius: 10px;
      border-image: linear-gradient(163deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.2)) 2 2;
    }

    .empetyBg {
      background-image: url(../../assets/images/empty.png);
      background-size: 200px auto;
      background-repeat: no-repeat;
      background-position: center;
    }

    .table_row_body {
      width: 100%;
      min-height: 400px;

      .table_row_item {
        margin-top: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        border-radius: 10px;
        //filter: blur(10px);
        font-size: 15px;
        font-weight: 600;

        .el-switch__core:after {
          top: 2px;
          background: linear-gradient(180deg, #FF31F7 0%, #3C16FF 100%);
        }

        .el-switch__core {
          background-color: #1D1443;
          border: none;
        }

        .el-switch.is-checked .el-switch__core {
          background-color: #480f91;
        }

        .table_row_assets {
          display: flex;
          align-items: center;

          .coinLogo {
            width: 40px;
            height: 40px;
          }

          .coinInfo {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .tokensubTxt {
              margin-top: 6px;
              font-size: 10px;
              font-weight: 400;
              color: #FFFFFF;
            }
          }

        }

        .table_row_action {
          display: flex;

          .btn {
            width: 41%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 25px;
            font-size: 15px;
            font-weight: 500;
            color: #FFFFFF;
          }

          .btn_deposit {
            background: linear-gradient(360deg, #00FFF9 0%, #7500FF 100%);
          }

          .btn_borrow {
            margin-left: 17px;
            background: linear-gradient(360deg, #FF00FD 0%, #4B00FF 100%);
          }

          .el-button.is-disabled,
          .el-button.is-disabled:focus,
          .el-button.is-disabled:hover {
            background: rgba(255, 255, 255, 0.3);
            color: #C0C4CC;
          }
        }

        .subTxt {
          margin-top: 6px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .tipsBox {
      margin-top: 15px;
      display: flex;
      align-items: center;

      .tipImg {
        width: 24px;
      }

      .tipTxt {
        margin-left: 20px;
        font-size: 14px;
        font-weight: 500;
        color: #FFFFFF;
      }
    }

    .titleBox {
      position: relative;
      display: flex;
      width: 280px;
      height: 48px;
      line-height: 48px;
      background: linear-gradient(135deg, rgba(228, 151, 227, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.5);
      border-radius: 10px;
      overflow: hidden;

      //filter: blur(10px);
      .item {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
      }

      .item_selected {
        position: absolute;
        width: 140px;
        height: 48px;
        background: linear-gradient(135deg, rgba(228, 151, 227, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        transition: all .3s;
        box-sizing: border-box;
      }

      .bg-deposit {
        color: #FFFFFF;
        border-radius: 10px;
        background: linear-gradient(135deg, rgba(6, 226, 235, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      }

      .bg-borrow {
        color: #FFFFFF;
        border-radius: 10px;
        background: linear-gradient(135deg, rgba(255, 61, 0, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      }
    }
  }

  .assetWrap {
    margin-top: 57px;

    .tab_box {
      width: 210px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    .earnings_tab {
      background: linear-gradient(135deg, rgba(132, 21, 217, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%);
    }

    .account_tab {
      margin-top: 40px;
      background: linear-gradient(135deg, rgba(121, 24, 120, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    }

    .claim_box {
      margin-top: 20px;
      padding: 0 76px 0 63px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 64%;
      height: 220px;
      background: linear-gradient(135deg, rgba(179, 80, 242, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 3px 8px 10px 0px rgba(83, 104, 204, 0.29);
      border-radius: 10px;
      //opacity: 0.8;
      border: 2px solid;
      border-image: linear-gradient(150deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2)) 2 2;

      //filter: blur(10px);
      .left_info {
        display: flex;
        align-items: center;

        .amaraLogo {
          width: 140px;
        }

        .info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-left: 40px;

          .title {
            font-size: 20px;
            font-weight: 600;
          }

          .number {
            margin-top: 10px;
            font-size: 40px;
            font-weight: 600;
            line-height: 56px;
          }
        }
      }

      .right_btn {
        width: 160px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.5);
        box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
        border-radius: 32px;
        font-size: 15px;
        font-weight: 500;
      }
    }

    .account_box {
      margin-top: 20px;
      padding: 0 80px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 160px;
      background: linear-gradient(121deg, rgba(239, 124, 192, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      box-shadow: 3px 8px 10px 0px rgba(83, 104, 204, 0.29);
      border-radius: 10px;
      opacity: 0.8;
      border: 2px solid;
      border-image: linear-gradient(150deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2)) 2 2;

      //filter: blur(10px);
      .account_item {
        display: flex;
        align-items: center;

        .balanceImg {
          width: 110px;
        }

        .balanceInfo_ratio {
          width: 250px;
        }

        .balanceInfo {
          margin-left: 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .el-slider__bar {
            background: linear-gradient(270deg, #FF00FA 0%, #2800FF 100%);
            box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
          }

          .el-slider__button {
            border: none;
            background: linear-gradient(90deg, #003EFF 0%, #FF00CB 100%);
            box-shadow: 1px 2px 8px 0px rgba(0, 0, 0, 0.2), 0px 1px 3px 0px rgba(255, 255, 255, 0.8);
          }

          .info {
            font-size: 16px;
            font-weight: 400;
            color: #FFFFFF;
          }

          .number {
            margin-top: 10px;
            font-size: 30px;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 42px;
          }

          .ratio {
            font-size: 18px;
            font-weight: 600;
            color: #FF00EC;
            text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }

  @media only screen and (min-width: 1440px) and (max-width: 1919px) {
    .assetWrap {
      .account_box {
        padding: 0 60px;

        .account_item {
          .balanceImg {
            width: 100px;
          }

          .balanceInfo {
            margin-left: 20px;

            .number {
              font-size: 26px;
            }
          }

          .balanceInfo_ratio {
            width: 236px;
          }
        }
      }
    }
  }

  @media only screen and (min-width: 1366px) and (max-width: 1439px) {
    .assetWrap {
      .account_box {
        padding: 0 30px;

        .account_item {
          .balanceImg {
            width: 90px;
          }

          .balanceInfo {
            margin-left: 10px;

            .number {
              font-size: 25px;
            }
          }

          .balanceInfo_ratio {
            width: 236px;
          }
        }
      }
    }
  }

  @media only screen and (min-width: 1000px) and (max-width: 1365px) {
    .assetWrap {
      .account_box {
        padding: 0 30px;

        .account_item {
          .balanceImg {
            width: 80px;
          }

          .balanceInfo {
            margin-left: 10px;

            .number {
              font-size: 25px;
            }
          }

          .balanceInfo_ratio {
            width: 236px;
          }
        }
      }
    }
  }
</style>

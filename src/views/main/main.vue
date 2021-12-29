<template>
  <div class="main">
    <div class="totalPlate">
      <div class="total_item">
        <span class="title">{{$t('market.totalDeposit')}}</span>
        <span class="number">${{ $tools.toThousands(mainnetSupplyValue,3)}}</span>
      </div>
      <div class="total_item">
        <span class="title">{{$t('market.totalBorrow')}}</span>
        <span class="number">${{ $tools.toThousands(mainnetBorrowValue,3)}}</span>
      </div>
      <div class="total_item">
        <span class="title">{{$t('market.totalValueLocked')}}</span>
        <span class="number">${{ $tools.toThousands(Number(mainnetSupplyValue) + Number(mainnetBorrowValue),3)}}</span>
      </div>
    </div>
    <!-- mainMarkets -->
    <div class="Mainstream" v-if="account">
      <div class="mainTitleBox">
        <span>{{$t('market.mainstreamMarket')}}</span>
      </div>
      <div class="table_row_header">
        <span class="pl-2 box-s-box" style="width: 12%;">{{$t('list.assets')}}</span>
        <span style="width: 12%;">{{$t('list.depositMarket')}}</span>
        <div class="d-flex a-center" style="width: 12%;">
          <span>{{$t('list.depositAPY')}}</span>
          <el-tooltip style="width: 12%;" effect="light" :content="$t('common.toolTip1')" placement="top-start">
            <img src="../../assets/images/question.png" class="question">
          </el-tooltip>
        </div>
        <span style="width: 12%;">{{$t('list.borrowMarket')}}</span>
        <div class="d-flex a-center" style="width: 12%;">
          <span>{{$t('list.borrowAPY')}}</span>
          <el-tooltip style="width: 12%;" effect="light" :content="$t('common.toolTip2')" placement="top-start">
            <img src="../../assets/images/question.png" class="question">
          </el-tooltip>
        </div>
        <span style="width: 10%;">{{$t('list.utilization')}}</span>
        <span style="width: 12%;">{{$t('list.yourBalance')}}</span>
        <span style="width: 18%;">{{$t('list.action')}}</span>
      </div>
      <div class="table_row_body">
        <div class="table_row_item" v-for="(item,index) in mainMarkets" :key="index">
          <div class="table_row_assets" style="width: 12%;">
            <img :src="item.assets_logo" class="coinLogo">
            <div class="coinInfo">
              <span>{{item.symbol}}</span>
              <span class="tokensubTxt">{{item.name}}</span>
            </div>
          </div>
          <div class="" style="width: 12%;text-align: left;">
            <span>${{$tools.numberFormat(item.totalDepositWithPrice,4)}}</span>
          </div>
          <div class="d-flex flex-column" style="width: 12%;text-align: left;">
            <span>{{item.suppliedRate || '0%'}}</span>
            <span class="subTxt">{{item.supplied_equalTo || '=0% + 0%'}}</span>
          </div>
          <div class="" style="width: 12%;text-align: left;">
            <span>${{$tools.numberFormat(item.totalBorrowWithPrice,4)}}</span>
          </div>
          <div class="d-flex flex-column" style="width: 12%;text-align: left;">
            <span>{{item.borrowedRate || '0%'}}</span>
            <span class="subTxt">{{item.borrowed_equalTo || '=0% + 0%'}}</span>
          </div>
          <div class="" style="width: 10%;text-align: left;">
            <span>{{item.utilRate? Number(item.utilRate * 100).toFixed(2) : 0}}%</span>
          </div>
          <div class="d-flex flex-column" style="width: 12%;text-align: left;">
            <span>{{ $tools.numberFormat(item.balance, 6, item.decimals)}} {{item.symbol}}</span>
            <span class="subTxt">{{$tools.numberFormat(item.iToken, 6, item.decimals)}} {{item.AToken}}</span>
          </div>
          <div class="table_row_action" style="width: 18%;">
            <el-button class="btn btn_deposit" :disabled="item.mintPaused" @click="showLoan(item,index,'Deposit')">
              {{$t('list.deposit')}}
            </el-button>
            <el-button class="btn btn_borrow" :disabled="item.borrowPaused" @click="showLoan(item,index,'Borrow')">
              {{$t('list.borrow')}}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <!--  innovateMarkets -->
    <!-- <div class="Mainstream" v-if="account">
      <div class="mainTitleBox"
        style="background: linear-gradient(135deg, rgba(6, 226, 235, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);">
        <span>{{$t('market.innovationMarket')}}</span>
      </div>
      <div class="table_row_header"
        style="background: linear-gradient(135deg, rgba(6, 226, 235, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);">
        <span class="pl-2 box-s-box" style="width: 12%;">{{$t('list.assets')}}</span>
        <span style="width: 12%;">{{$t('list.depositMarket')}}</span>
        <div class="d-flex a-center" style="width: 12%;">
          <span>{{$t('list.depositAPY')}}</span>
          <el-tooltip style="width: 12%;" effect="light" :content="$t('common.toolTip1')" placement="top-start">
            <img src="../../assets/images/question.png" class="question">
          </el-tooltip>
        </div>
        <span style="width: 12%;">{{$t('list.borrowMarket')}}</span>
        <div class="d-flex a-center" style="width: 12%;">
          <span>{{$t('list.borrowAPY')}}</span>
          <el-tooltip style="width: 12%;" effect="light" :content="$t('common.toolTip2')" placement="top-start">
            <img src="../../assets/images/question.png" class="question">
          </el-tooltip>
        </div>
        <span style="width: 10%;">{{$t('list.utilization')}}</span>
        <span style="width: 12%;">{{$t('list.yourBalance')}}</span>
        <span style="width: 18%;">{{$t('list.action')}}</span>
      </div>
      <div class="table_row_body">
        <div class="table_row_item" v-for="(item,index) in innovateMarkets" :key="index"
          style="background: linear-gradient(135deg, rgba(151, 217, 228, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)">
          <div class="table_row_assets" style="width: 12%;">
            <img :src="item.assets_logo" class="coinLogo">
            <div class="coinInfo">
              <span>{{item.symbol}}</span>
              <span class="tokensubTxt">{{item.name}}</span>
            </div>
          </div>
          <div class="" style="width: 12%;text-align: left;">
            <span>${{$tools.numberFormat(item.totalDepositWithPrice,4)}}</span>
          </div>
          <div class="d-flex flex-column" style="width: 12%;text-align: left;">
            <span>{{item.suppliedRate || '0%'}}</span>
            <span class="subTxt">{{item.supplied_equalTo || '=0% + 0%'}}</span>
          </div>
          <div class="" style="width: 12%;text-align: left;">
            <span>${{$tools.numberFormat(item.totalBorrowWithPrice,4)}}</span>
          </div>
          <div class="d-flex flex-column" style="width: 12%;text-align: left;">
            <span>{{item.borrowedRate || '0%'}}</span>
            <span class="subTxt">{{item.borrowed_equalTo || '=0% + 0%'}}</span>
          </div>
          <div class="" style="width: 10%;text-align: left;">
            <span>{{item.utilRate? Number(item.utilRate * 100).toFixed(2) : 0}}%</span>
          </div>
          <div class="d-flex flex-column" style="width: 12%;text-align: left;">
            <span>{{ $tools.numberFormat(item.balance, 6, item.decimals)}} {{item.symbol}}</span>
            <span class="subTxt">{{$tools.numberFormat(item.iToken, 6, item.decimals)}} {{item.AToken}}</span>
          </div>
          <div class="table_row_action" style="width: 18%;">
            <el-button class="btn btn_deposit" :disabled="item.mintPaused" @click="showLoan(item,index,'Deposit')">
              {{$t('list.deposit')}}
            </el-button>
            <el-button class="btn btn_borrow" :disabled="item.borrowPaused" @click="showLoan(item,index,'Borrow')">
              {{$t('list.borrow')}}
            </el-button>
          </div>
        </div>
      </div>
    </div> -->
    <div class="emptyWallet" v-if="!account">
      <img src="../../assets/images/empty.png" class="emptyImg">
      <!-- <el-button class="connectBtn" @click="dialogVisible = true">{{$t('common.connectWallet')}}</el-button> -->
    </div>
    <loan-popup :dialogVisible="loanDialogVisible" :showDepositModel="showDepositModel" :ATokenInfo="ATokenInfo"
      @reload="reload()" @handleClose="handleLoanClose"></loan-popup>
    <!-- <div class="footerWrap">
      <span>Terms of Service</span>
      <span>Security</span>
      <span>Audited by</span>
    </div> -->
  </div>
</template>

<script>
  import {
    mapActions,
    mapState,
    mapGetters
  } from "vuex";
  import {
    totalList
  } from "@/common/api/chain.js";
  const BigNumber = require('bignumber.js');
  import * as constants from "@/store/constants";
  import wPopup from '@/components/w-popup/w-popup.vue';
  import loanPopup from '@/components/loan-popup/loan-popup.vue';
  // import * as echarts from "echarts";
  export default {
    data() {
      return {
        ATokenInfo: {},
        showDepositModel: true,
        loanDialogVisible: false,
        totalSupplied: 0,
        totalBorrowed: 0,
        marketList: [],
        AccountHealth: 0,
        borrowLimitWithPrice: 0,
        borrowLimitWithPriceChange: 0,
        mainnetSupplyValue: 0,
        mainnetBorrowValue: 0,
        tableLoading: false,
        mainMarkets: [
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
        innovateMarkets: [],
      };
    },
    components: {
      wPopup,
      loanPopup,
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
        language: (state) => state.Session.language,
        chainId: (state) => state.Session.chainId,
      }),
      allMarketList() {
        return this.mainMarkets.concat(this.innovateMarkets);
      }
    },
    watch: {
      language(newValue, old) {},
      account() {
        if (this.account) {
          this.getAllMarketsInfo();
        }
      },
    },
    created() {
      if (this.account) {
        this.getAllMarketsInfo();
      }
      setInterval(() => {
        if (this.account) {
          this.getAllMarketsInfo();
        }
      }, 60000);
    },
    mounted() {},
    methods: {
       async showLoan(row, index,flag){
          this.marketList = await this.$unitroller.markets();
          var idx = this.marketList.findIndex(item => item.address == row.address);
          this.ATokenInfo = {
            marketInfo: row,
            market: this.marketList[idx],
            totalBorrowed: this.totalBorrowed,
            totalBorrowedWithMantisa: this.totalBorrowedWithMantisa,
            totalSupplied: this.totalSupplied,
            borrowLimitWithPrice: this.borrowLimitWithPrice,
            AccountHealth: this.AccountHealth
          }
          this.loanDialogVisible = true;
          if (flag == 'Deposit') {
            this.showDepositModel = true;
          }else if(flag == 'Borrow') {
            this.showDepositModel = false;
          }
      },
      handleLoanClose() {
        this.loanDialogVisible = !this.loanDialogVisible
      },
      reload() {
        this.loanDialogVisible = false;
        this.getAllMarketsInfo();
      },
      getAllMarketsInfo() {
        let that = this;
        this.totalSupplied = 0;
        this.totalBorrowed = 0;
        this.totalBorrowedWithMantisa = 0;
        this.borrowLimitWithPrice = 0;
        let mainnetSupplyValue_ = 0;
        let mainnetBorrowValue_ = 0;
        this.allMarketList.map( (market, index) => {
          this.$AmaraLendLens.ATokenMetadata(market.address).then((ATokenMetadata) => {
            market.decimals = Number(ATokenMetadata['underlyingDecimals']);
            let decimals = market.decimals;
            let priceMantisa = Math.pow(10, 18 + 18 - decimals);
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
              market.utilRate=0;
            } else {
              let x = new BigNumber(market.cash).plus(new BigNumber(market.totoalBorrow))
              let res =  new BigNumber(market.totoalBorrow).div(new BigNumber(x).minus(new BigNumber(market.totalReservers)))
              market.utilRate = res.dp(2).toNumber()
            }
            market.totalDepositWithPrice = Number(
              (((market.totalSupply / Math.pow(10, decimals)) *
                  market.exchangeRateStored) /
                Math.pow(10, 18)) *
              Number(market.marketPrice / priceMantisa)
            );
            market.totalBorrowWithPrice = Number((market.totoalBorrow / Math.pow(10, decimals)) *
              Number(market.marketPrice / priceMantisa)
            )
            mainnetSupplyValue_ += market.totalDepositWithPrice;
            mainnetBorrowValue_ += market.totalBorrowWithPrice;
            this.mainnetSupplyValue = mainnetSupplyValue_;
            this.mainnetBorrowValue = mainnetBorrowValue_;
            return [this.$AmaraLendLens.ATokenBalances(market.address, this.account), this
              .$unitroller.getAccountLiquidity(this.account),this.$Amara.getATokenMetadata(market.address), market
            ]
          }).then((promises) => Promise.all(promises)).then(async ([ATokenBalances, liquidity, ATokenMetadata,market]) => {
            let balance = (ATokenBalances['tokenBalance']);
            let supplyOf = (ATokenBalances['balanceOf']);
            let borrowOf = (ATokenBalances['borrowBalanceCurrent']);
            let decimals = market.decimals;
            let priceMantisa = Math.pow(10,18 + 18 - decimals);

            let supplyOfValue = Number(supplyOf / Math.pow(10, decimals) * (market.exchangeRateStored  / Math.pow(10, 18))* Number(market.marketPrice /
              priceMantisa));

           this.totalSupplied +=
             (((supplyOf / Math.pow(10, decimals)) *
                 market.exchangeRateStored) /
               Math.pow(10, 18)) *
             Number(market.marketPrice / priceMantisa);

           this.totalBorrowed +=
             (borrowOf / Math.pow(10, decimals)) *
             Number(market.marketPrice / priceMantisa);

           this.totalBorrowedWithMantisa += Number(
             borrowOf * Number(market.marketPrice / Math.pow(10, 18))
           );
            that.AccountHealth =this.totalBorrowedWithMantisa > 0 ?
              this.$tools.asDouble((this.totalBorrowedWithMantisa / (Number(liquidity) + this.totalBorrowedWithMantisa)) * Math.pow(10, 2), 4) : "0.00";

            this.price = market.marketPrice;
            let supplyValue = this.$tools.asDouble((supplyOf * market.exchangeRateStored) / Math.pow(10, 18),decimals,decimals);
            let marketAvaliable = Number(market.cash - market.totalReservers) < 0 ? 0 : Number(market.cash - market.totalReservers);

            var comSupplyRate = Number(Number(ATokenMetadata[1]) / Math.pow(10, 4));
            var comBorrowRate = Number( Number(ATokenMetadata[2]) / Math.pow(10, 4));
            var totalSupplyRate = market.supplyRate + comSupplyRate;
            var totalBorrowRate = market.borrowRate - comBorrowRate;
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
            market.supplyBalanceInfoWithMantisa = (supplyOf * market.exchangeRateStored * market.marketPrice) / Math.pow(10, 18) /
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
            if (market.collateral) {
              this.borrowLimitWithPrice += supplyOfValue * market.collateralFactorMantissa / Math.pow(10, 18);
            }
          })
        });
      },
    },
  };
</script>

<style lang="scss">
  .Mainstream {
    .mainTitleBox {
      margin-top: 40px;
      width: 210px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: linear-gradient(135deg, rgba(121, 24, 120, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
      border-radius: 10px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      //filter: blur(10px);
      font-size: 18px;
      font-weight: 600;
    }

    .table_row_header {
      margin-top: 20px;
      padding-left: 20px;
      box-sizing: border-box;
      width: 100%;
      height: 66px;
      display: flex;
      align-items: center;
      background: linear-gradient(180deg, rgba(239, 68, 237, 0.35) 0%, rgba(255, 255, 255, 0.1) 100%);
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

    .empetyBg {
      background-image: url(../../assets/images/empty.png);
      background-size: 230px 260px;
      background-repeat: no-repeat;
      background-position: center;
    }

    .table_row_body {
      width: 100%;
      min-height: 260px;

      .table_row_item {
        margin-top: 15px;
        padding-left: 20px;
        box-sizing: border-box;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        background: linear-gradient(135deg, rgba(228, 151, 227, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
        box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
        border-radius: 10px;
        //filter: blur(10px);
        font-size: 15px;
        font-weight: 600;

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
              text-align: left;
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

  }

  .totalPlate {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 60px;
    width: 100%;
    height: 160px;
    background: linear-gradient(135deg, rgba(241, 108, 187, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%);
    box-shadow: 3px 8px 10px 0px rgba(83, 104, 204, 0.29);
    border-radius: 10px;
    opacity: 0.8;
    border: 2px solid;
    border-image: linear-gradient(150deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2)) 2 2;

    //filter: blur(10px);
    .total_item {
      display: flex;
      flex-direction: column;

      .title {
        font-size: 18px;
        font-weight: 600;
      }

      .number {
        margin-top: 30px;
        font-size: 32px;
        font-weight: 600;
      }
    }
  }

  .emptyWallet {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .emptyImg {
      width: 230px;
    }

    .connectBtn {
      margin-top: 20px;
      width: 270px;
      height: 48px;
      background: linear-gradient(90deg, #DD32BA 0%, #6150F2 100%);
      box-shadow: 1px 1px 2px 0px rgba(189, 29, 164, 0.5), 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
      border-radius: 24px;
      color: #FFFFFF;
    }
  }

  .footerWrap {
    position: absolute;
    right: 54px;
    bottom: 40px;
    display: flex;
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);

    span {
      margin-left: 45px;
    }
  }


  @media only screen and (min-width: 1440px) and (max-width: 1919px) {
    .container {
      .block {
        .block-right {
          padding: 40px;

          .topWrap {
            .right_btns {
              .accountBox {
                .accountInfo {
                  padding: 20px 10px;

                  .accountTxt {
                    margin-left: 8px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (min-width: 1366px) and (max-width: 1439px) {
    .container {
      .block {
        .block-right {
          padding: 40px 25px;

          .topWrap {
            .right_btns {
              .accountBox {
                .accountInfo {
                  padding: 20px 10px;

                  .accountTxt {
                    margin-left: 8px;
                  }
                }

                .netWorkSelect {
                  padding: 0 10px;
                }
              }
            }
          }
        }
      }
    }

  }

  @media only screen and (min-width: 1000px) and (max-width: 1365px) {
    .container {
      .block {
        .block-left {
          .logo-sm-amara {
            width: 40px;
          }

          .menu-box {
            margin-top: 10px;

            .divide {
              margin: 10px auto;
            }

            .menu-item {
              height: 56px;
            }
          }
        }

        .block-right {
          padding: 40px 20px;

          .topWrap {
            .right_btns {
              .accountBox {

                .accountInfo {
                  padding: 20px 10px;

                  .accountTxt {
                    margin-left: 2px;
                  }
                }

                .netWorkSelect {
                  padding: 0 8px;
                }
              }
            }
          }
        }
      }
    }

    .Mainstream {
      .table_row_body {
        .table_row_item {
          .table_row_action {
            .btn {
              font-size: 13px;
            }
          }
        }
      }
    }

  }
</style>

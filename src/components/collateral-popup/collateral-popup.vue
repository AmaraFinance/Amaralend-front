<template>
  <div>
    <w-popup class="collateral-popup" :dialogTitle="dialogTitle" :dialogVisible="dialogVisible" @handleClose="handleClose" v-if="collateralInfo">
      <div class="imgBox">
        <img :src="collateralInfo.assets_logo" />
        <span class="dia-title">{{ collateralInfo.assets }}</span>
      </div>
      <div class="desBox">
        <span>{{$t('market.eachLiquidation')}}</span>
      </div>
      <div class="dataItem mt-3">
        <span>{{$t('market.borrowLimit')}}:</span>
        <span>${{ Number(collateralInfo.borrowLimitWithPrice).toLocaleString() }} -> ${{
            Number(collateralInfo.borrowLimitWithPriceChange).toLocaleString()
          }}</span>
      </div>
      <div class="dataItem">
        <span>{{$t('market.usedQuota')}}:</span>
        <span>{{ Number($tools.asDouble(collateralInfo.AccountHealth, 4)).toLocaleString() }}% ->
          {{ Number(collateralInfo.AccountHealthChange).toLocaleString() }}%</span>
      </div>
      <el-button  type="primary" class="btn-enable" :loading="isLoading" @click="enterMarket">{{collateralInfo.operateMarketText}}</el-button>
    </w-popup>
  </div>
</template>

<script>
  import {
    mapState,
  } from "vuex";
  import wPopup from '@/components/w-popup/w-popup.vue';
  export default {
    data() {
      return {
        isLoading: false
      }
    },
    props: {
      dialogVisible: {
        type: Boolean,
        default: true
      },
      dialogTitle: {
        type: String,
        default: ''
      },
      collateralInfo: {
        type: Object,
      }
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
        language: (state) => state.Session.language,
      }),
    },
    components: {
      wPopup
    },
    methods: {
      handleClose() {
        this.$emit('handleClose')
      },
      enterMarket() {
        let market = this.collateralInfo.market;
        let isCollateral = market.collateral;
        this.isLoading = true;
        if (!isCollateral) {
          this.$unitroller
            .enterMarkets(market.address, this.account)
            .then((res) => {
              this.$emit('optFinished')
              market.collateral = !market.collateral;
              this.$message({
                message: this.$t('market.enterSuccess'),
                type: "success",
              });
              this.isLoading = false;
            })
            .catch((err) => {
             this.$emit('optFinished')
              this.$message({
                message: this.$t('market.enterFail'),
                type: "Fail",
              });
              this.isLoading = false;
            });
        } else {
          this.$unitroller
            .exitMarket(market.address, this.account)
            .then((res) => {
              this.$emit('optFinished')
              market.collateral = !market.collateral;
              this.$message({
                message: this.$t('market.exitSuccess'),
                type: "success",
              });
              this.isLoading = false;
            })
            .catch((err) => {
              this.$emit('optFinished')
              this.$message({
                message: this.$t('market.exitFail'),
                type: "Fail",
              });
              this.isLoading = false;
            });
        }
      },
    }
  }
</script>

<style lang="scss">
  .collateral-popup {

    .imgBox {
      margin-top: 24px;
      margin-bottom: 35px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        width: 80px;
      }

      .dia-title {
        margin-top: 20px;
        font-size: 25px;
        // font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
      }
    }
      .dataItem {
        margin-top: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          font-size: 20px;
          font-family: PingFang Bold;
          font-weight: 600;
          color: #FFFFFF;
        }
      }
      .desBox {
        margin-top: 30px;
        span {
          font-size: 20px;
          font-weight: 600;
          color: #FFFFFF;
          line-height: 28px;
        }
      }
      .btn-enable {
        margin-top: 40px;
        margin-bottom: 10px;
        width: 100%;
        height: 70px;
        background: linear-gradient(160deg, #DC19C1 0%, #121FF0 100%);
        border-radius: 10px;
        font-size: 22px;
      }
      .el-dialog__headerbtn {
        top: 27px;
      }

  }
</style>

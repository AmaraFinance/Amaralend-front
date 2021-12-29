<template>
  <div>
    <div class="Mainstream" v-if="account">
      <div class="mainTitleBox">
        <span @click="Stake">{{$t('stake.title2')}}</span>
      </div>
      <div class="table_row_header">
        <span class="pl-2 box-s-box" style="width: 20%;">{{$t('list.assets')}}</span>
        <span style="width: 20%;">{{$t('stake.staked')}}</span>
        <span style="width: 20%;">{{$t('stake.totalStaked')}}</span>
        <span style="width: 20%;">{{$t('stake.APR')}}</span>
        <span style="width: 20%;">{{$t('stake.action')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  export default {
    data() {
      return {

      }
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
      }),
    },
    created() {
      if (this.account) {
        this.$amaraToken.eventualDecimals.then((decimal_) => {
          //  console.log('decimal_',decimal_)
        }).catch((err) => {})
      }
    },
    methods: {
      Stake() {
        this.$BaseStake.getBalanceOf(this.account).then((res) => {
          console.log('getBalanceOf', res)
        })
        this.$BaseStake.stake('1000000000000000000', this.account).then((res) => {
          console.log('stake', res)
        })
        // this.$BaseStake.withdraw('1000000000000000000',this.account).then((res) => {
        //   console.log('withdraw',res)
        // })
        // this.$BaseStake.exit().then((res) => {
        //   console.log('exit',res)
        // })
      }
    },
  }
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
  }
</style>

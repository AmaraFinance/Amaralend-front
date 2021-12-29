<template>
  <div>
    
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import wPopup from '../../components/w-popup/w-popup.vue';
  export default {
    data() {
      return {
        activeName: 'farms',
        airdropActiveName: 'Airdrop',
        tableLoading: false,
        svlDatalist: [],
        dialog_title: 'SVL',
        dialogVisible: false,
        dialogVisible1: false,
        activeName1: '',
        loanIptValue: '',
        withdrawIptValue: '',
        loanSlidervalue: 0,
        isLoading: false,
        buttonDisabled: true,
        withdraw_isLoading: false,
        withdraw_buttonDisabled: true,
        stakedSvl: 0,
        totalStaking: 0,
        decimal_: 0,
        unLockReward: 0,
        earndBySvlPledge: 0,
        eventualBalanceOf: 0,
        eventualBalanceOfLp: 0,
        earndByShorel: 0,
        poolType: '',
        withdrawFrom: '',
        maxWithdrawAmount_: 0,
        rewardRate_: 0,
        LPSvlProportion_: 0,
        airDropBalance: 0,
        airDrop_isLoading: false,
        airBalance_original: 0
      }
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
        token: (state) => state.Session.token,
        language: (state) => state.Session.language,
      }),
      contractAmount() {
        let amount = this.$tools.asDouble(this.loanIptValue * Math.pow(10, this.decimal_), 0);
        return amount;
      },
      withAmount() {
        let amount = this.$tools.asDouble(this.withdrawIptValue * Math.pow(10, this.decimal_), 0);
        return amount;
      },
      farmEarnings() {
        let earn = (Number(this.loanIptValue) / (Number(this.totalStaking) + Number(this.loanIptValue)) * this
          .rewardRate_ *
          31536000);
        return this.$tools.asDouble(earn, 2, this.decimal_)
      },
      lpWithdrawLimit() {
        var num = this.loanIptValue * this.LPSvlProportion_
        return this.$tools.asDouble(num, 2, this.decimal_)
      },
      svlAPR() {
        let earn = (1 / (Number(this.totalStaking) + 1) * this.rewardRate_ *
          31536000) * 100;
        return this.$tools.asDouble(earn, 2, this.decimal_)
      }
    },
    components: {
      wPopup
    },
    watch: {
      account: {
        handler() {
          if (this.account) {
            this.$amaraToken.eventualDecimals
              .then((decimal_) => {
                this.decimal_ = decimal_;
                this.getBalanceOfSvl();
                this.getTotalStaking();
                this.getUnLockReword();
                this.getEarndBySvlPledge();
                this.getEarndByShorel();
                this.getEventualBalanceOf();
                this.getEventualBalanceOfLp();
                this.rewardRate();
                this.getLockArr()
                this.LPSvlProportion();
                this.getAirDropBalance();

              }).catch((err) => {})
          }
        },
        immediate: true
      },
      language(newValue, old) {
        this.activeName1 = this.$t('farm.stake')
      },
      loanIptValue(newVal, oldVal) {
        var amount = this.verifyBalanceByModel();
        if (Number(newVal) <= 0 || Number(newVal) > Number(amount) || newVal == '') {
          this.buttonDisabled = true
        } else {
          this.buttonDisabled = false
        }
        var temp = Number(newVal / amount * 100).toFixed(2);
        if (!this.$tools.isNumber(Number(temp))) {
          temp = 0;
        }
        this.loanSlidervalue = Number(temp) >= 100 ? 100 : Number(temp);
      },
      withdrawIptValue(newVal, oldVal) {
        var amount = this.maxWithdrawAmount();
        if (Number(newVal) <= 0 || Number(newVal) > Number(amount) || newVal == '') {
          this.withdraw_buttonDisabled = true
        } else {
          this.withdraw_buttonDisabled = false
        }
      }
    },
    created() {
      this.activeName1 = this.$t('farm.stake')
    },
    mounted() {},
    methods: {
      getAirDropBalance() {
        this.$Unlock.getAirDropBalance(this.account).then((res) => {
          this.airBalance_original = res;
          this.airDropBalance = this.$tools.asDouble(res, 2, this.decimal_);
        }).catch((err) => {
          console.log(err)
        })
      },
      withdrawAirDrop() {
        if (Number(this.airDropBalance) <= 0) return;
        if (Number(this.airDropBalance) > Number(this.unLockReward)) {
          this.$message.error(this.$t('farm.withdrawAirDropError'));
          return
        }
        this.airDrop_isLoading = true;
        this.$Unlock.withdrawAirDrop(this.airBalance_original).then((res) => {
          this.$message({
            message: this.$t('farm.withdrawAirDropSuccess'),
            type: "success",
          });
          this.airDrop_isLoading = false;
          this.getAirDropBalance();
          this.getUnLockReword();
        }).catch((err) => {
          this.airDrop_isLoading = false;
          console.log(err)
        })
      },
      LPSvlProportion() {
        this.$Unlock.LPSvlProportion().then((res) => {
          this.LPSvlProportion_ = res
        }).catch((err) => {
          console.log(err)
        })
      },
      rewardRate() {
        this.$Svlbase.rewardRate().then((res) => {
          this.rewardRate_ = res
        }).catch((err) => {
          console.log(err)
        })
      },
      withdrawConfirm() {
        this.withdraw_isLoading = true;
        switch (this.withdrawFrom) {
          case 'withdraw_bySvl':
            this.getRewardBySvlPledge();
            break;
          case 'withdraw_byShorel':
            this.getRewardByShorel();
            break;
        }
      },
      maxWithdrawBtn() {
        this.withdrawIptValue = this.maxWithdrawAmount_;
      },
      withdrawAction(where) {
        this.withdrawFrom = where;
        this.dialogVisible1 = true;
        this.maxWithdrawAmount_ = this.maxWithdrawAmount();
      },
      maxWithdrawAmount() {
        var amount = this.verifyByWithdrwType();
        return Number(this.unLockReward) > Number(amount) ? Number(amount) : Number(this.unLockReward);
      },
      getRewardBySvlPledge() {
        this.$Unlock.getRewardBySvlPledge(this.withAmount, this.$envConfig.VUE_SVLPOOL).then((res) => {
          this.handleClose1();
          this.getEarndBySvlPledge();
          this.getEventualBalanceOf();
          this.getUnLockReword()
        }).catch((err) => {
          this.handleClose1();
        })
      },
      getRewardByShorel() {
        this.$Unlock.getRewardByShorel(this.withAmount, this.$envConfig.VUE_APP_UNICONTROLLER).then((res) => {
          this.handleClose1();
          this.getEarndByShorel();
          this.getUnLockReword();
          this.getEventualBalanceOf();
        }).catch((err) => {
          this.handleClose1();
          // this.$message.error(this.$t('error.rewardFailed'));
          console.log('err', err)
        })
      },
      getEarndBySvlPledge() {
        this.$Unlock.getEarndBySvlPledge(this.$envConfig.VUE_SVLPOOL, this.account).then((res) => {
          this.earndBySvlPledge = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {
          // this.$message.error(this.$t('error.rewardFailed'));
          console.log(err)
        })
      },
      getEarndByShorel() {
        this.$unitroller.getMarketList().then((marketList) => {
          return this.$Amara.calcAccountAllAccrued(
            this.account,
            marketList
          );
        }).then((res) => {
          this.earndByShorel = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {
          console.log(err)
        })
      },
      getLockArr() {
        this.tableLoading = true;
        this.$Unlock.getLockArr(this.account).then(async (arr) => {
          this.svlDatalist = [];
          if (arr.length <= 0) {
            this.tableLoading = false;
            return
          }
          for (let i = 0; i < arr.length; i++) {
            await this.$Unlock.getLockedData(arr[i], this.account).then((res) => {
              var endTime = res.endTime * 1000;
              var remainder = (endTime - Date.now()) >= 0 ? endTime - Date.now() : 0
              var tempIdx = this.svlDatalist.findIndex(item => item.index == arr[i]);
              if (tempIdx == -1) {
                this.svlDatalist.push({
                  name: 'SVL-USDT',
                  symbol1: require("../../assets/images/coin-usdt.png"),
                  symbol2: require("../../assets/images/mara.png"),
                  remainder: this.$tools.formatDuring(remainder),
                  remainder_seconds: (endTime - Date.now()) >= 0 ? endTime - Date.now() : 0,
                  index: res.index,
                  state: res.state,
                  pledgeAmount: this.$tools.asDouble(res.pledgeAmount, 2, this.decimal_),
                  unLockAmount: this.$tools.asDouble(res.unLockAmount, 2, this.decimal_),
                  loading: false,
                })
              }
              this.tableLoading = false;
            }).catch((err) => {
              this.tableLoading = false;
            })
          }
        })
      },
      getEventualBalanceOf() {
        this.$amaraToken.eventualBalanceOf(this.account).then((res) => {
          this.eventualBalanceOf = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {
          console.log(err)
        })
      },
      getEventualBalanceOfLp() {
        this.$lpToken.eventualBalanceOf(this.account).then((res) => {
          this.eventualBalanceOfLp = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {
          console.log(err)
        })
      },
      getUnLockReword() {
        this.$Unlock.getUnLockReword(this.account).then((res) => {
          this.unLockReward = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {
          console.log(err)
        })
      },
      getBalanceOfSvl() {
        this.$Svlbase.getBalanceOf(this.account).then((res) => {
          this.stakedSvl = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {})
      },
      getTotalStaking() {
        this.$Svlbase.getTotalSupply().then((res) => {
          this.totalStaking = this.$tools.asDouble(res, 2, this.decimal_)
        }).catch((err) => {
          console.log(err)
        })
      },
      svlStake(amount, account) {
        this.$Svlbase.stake(amount, account).then((res) => {
          this.refreshSvlData();
          this.clear();
        }).catch((err) => {
          console.log(err)
          this.clear();
        })
      },
      svlUnstake(amount, account) {
        this.$Svlbase.withdraw(amount, account).then((res) => {
          this.refreshSvlData();
          this.clear();
        }).catch((err) => {
          console.log(err)
          this.clear();
        })
      },
      unLockStake() {
        this.$Unlock.stake(this.contractAmount, this.account).then((res) => {
          this.refreshSvlData();
          this.getLockArr();
          this.clear();
        }).catch((err) => {
          console.log(err)
          this.clear();
        })
      },
      applyAction() {
        this.buttonDisabled = true;
        this.isLoading = true;
        switch (this.activeName1) {
          case this.$t('farm.stake'):
            if (this.poolType == 'lpPool') {
              this.unLockStake()
            }else if (this.poolType == 'svlPool'){
              this.svlStake(this.contractAmount, this.account);
            }
            break;
          case this.$t('farm.unstake'):
            this.svlUnstake(this.contractAmount, this.account);
            break;
        }
      },
      verifyBalanceByModel() {
        var amount = 0;
        switch (this.activeName1) {
          case this.$t('farm.stake'):
            if (this.poolType == 'svlPool') {
              amount = this.eventualBalanceOf;
            } else if (this.poolType == 'lpPool') {
              amount = this.eventualBalanceOfLp;
            }
            break;
          case this.$t('farm.unstake'):
            amount = this.stakedSvl;
            break;
        }
        return amount;
      },
      verifyByWithdrwType() {
        var amount = 0;
        switch (this.withdrawFrom) {
          case 'withdraw_bySvl':
            amount = this.earndBySvlPledge;
            break;
          case 'withdraw_byShorel':
            amount = this.earndByShorel;
            break;
        }
        return amount;
      },
      onSliderIpt(val) {
        var amount = this.verifyBalanceByModel();
        this.loanIptValue = this.$tools.asDouble(val / 100 * amount, 2);
      },
      formatTooltip(val) {
        return val + "%";
      },
      maxbuttonAction() {
        this.loanIptValue = this.verifyBalanceByModel();
      },
      changeLoanModel(tab, event) {
        this.loanIptValue = "";
        this.loanSlidervalue = 0;
      },
      refreshSvlData() {
        this.getBalanceOfSvl();
        this.getTotalStaking();
        this.getEventualBalanceOf();
        this.getEventualBalanceOfLp();
        this.$forceUpdate();
      },
      handleClose() {
        this.clear();
      },
      handleClose1() {
        this.dialogVisible1 = false;
        this.withdrawIptValue = '';
        this.withdraw_isLoading = false;
      },
      clear() {
        setTimeout(() => {
          this.dialogVisible = false;
          this.loanIptValue = '';
          this.loanSlidervalue = 0;
          this.activeName1 = '';
          this.poolType = '';
          this.isLoading = false;
          this.$nextTick(() => {
            var unStakeDom = document.getElementById('tab-' + this.$t('farm.unstake'))
            unStakeDom.style = 'display:inline-block;'
          })
        }, 300)
      },
      lpStakeBtn() {
        this.dialogVisible1 = true;
      },
      lpUnstakeBtn(index, row) {
        var info;
        row.remainder_seconds > 0 ? info = this.$t('farm.unstakeIncome') : info = this.$t('farm.confirmTo');
        this.$confirm(info, this.$t('farm.unstake'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'info'
        }).then(() => {
          row.loading = true
          this.$Unlock.updateOrder(row.index).then((res) => {
            this.getLockArr();
            this.getUnLockReword();
            this.getEventualBalanceOfLp();
          }).catch((err) => {
            console.log(err)
            row.loading = false
          })
        }).catch(() => {});

      },
      handleStake(flag, row) {
        this.activeName1 = this.$t('farm.stake')
        this.poolType = flag;
        this.dialog_title = row.name;
        this.dialog_logo = row.symbol1;
        this.dialogVisible = true;
        if (this.poolType == 'lpPool') {
          this.$nextTick(() => {
            var unStakeDom = document.getElementById('tab-' + this.$t('farm.unstake'))
            unStakeDom.style = 'display:none;'
          })
        }
      },
      handleUnstake(flag, row) {
        this.activeName1 = this.$t('farm.unstake')
        this.poolType = flag;
        this.dialog_title = row.name;
        this.dialog_logo = row.symbol1;
        this.dialogVisible = true;
      },
      gotoLp() {
        window.open('https://pancakeswap.info/pool/' + this.$envConfig.VUE_LP_TOKEN, '_blank')
      },
    }
  }
</script>

<style lang="scss">
  
</style>

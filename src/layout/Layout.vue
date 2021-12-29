<template>
 <div class="container flex-col">
   <div class="block">
     <div class="" >
       <div class="block-left" :class="{'w150':isCollapse}">
         <template>
           <img src="../assets/images/logo-amara.png" v-show="!isCollapse" class="logo-amara">
           <img src="../assets/images/sm-amara.png" v-show="isCollapse" class="logo-sm-amara">
         </template>
         <!-- <div class="mt-3">
           <span class="blockTxt">Current block：- -</span>
         </div> -->
         <div class="menu-box" :class="isCollapse ? 'isCollapse' : ''">
           <div class="div-vertical">
             <!-- <div class="hoverBg">
               <img src="../assets/images/hover.png" style="width: 276px;">
             </div> -->
             <div class="menu-item" :class="{'active': menuIndex === 0}" @click="goToPage(0,'/')">
               <div class="iconbox1 meun-icon"></div>
               <span class="menu-title">Market</span>
             </div>
             <div class="menu-item"  :class="{'active': menuIndex === 1}" @click="goToPage(1,'/asset')">
               <div class="iconbox2 meun-icon"></div>
               <span class="menu-title">My Assets</span>
             </div>
             <!-- <div class="menu-item"  :class="{'active': menuIndex === 2}" @click="goToPage(2,'/stake')">
               <div class="iconbox3 meun-icon"></div>
               <span class="menu-title">Stake</span>
             </div> -->
             <div class="menu-item">
               <div class="iconbox4 meun-icon"></div>
               <el-tooltip effect="light" :content="$t('common.comingSoon')"  placement="right">
                  <span class="">Stake</span>
               </el-tooltip>
             </div>
             <div class="menu-item">
               <div class="iconbox4 meun-icon"></div>
               <el-tooltip effect="light" :content="$t('common.comingSoon')"  placement="right">
                 <div class="menu-title d-flex flex-column">
                   <span class="">MaraLink</span>
                   <span class="" style="font-size: 12px;">Cross-Chain</span>
                 </div>
               </el-tooltip>
             </div>
             <div class="divide"></div>
             <div class="menu-item">
               <div class="iconbox5 meun-icon"></div>
               <el-tooltip effect="light" :content="$t('common.comingSoon')"  placement="right">
                 <span class="menu-title">NFT</span>
               </el-tooltip>
             </div>
             <div class="menu-item">
               <div class="iconbox6 meun-icon"></div>
               <el-tooltip effect="light" :content="$t('common.comingSoon')"  placement="right">
                 <span class="menu-title">DAO</span>
               </el-tooltip>
             </div>
             <div class="menu-item">
               <div class="iconbox7 meun-icon"></div>
               <!-- <span class="menu-title">FAQ</span> -->
               <a href="https://amara.gitbook.io/amara-finance/" target="_blank" class="menu-title-faq" v-show="!isCollapse">FAQ</a>
             </div>
           </div>
         </div>
         <div class="bottom-box">
           <!-- <span class="curPriceTxt">MARA Current Price：${{baseTokenPrice}}</span> -->
           <!-- <div class="buyBox">
             Buy
           </div> -->
           <span class="followTxt">{{$t('common.followUs')}}</span>
           <div class="footBox">
             <div class="left">
               <a href="https://twitter.com/AmaraFinance" target="_blank"> <img src="../assets/images/twitter.png" ></a>
               <a href="https://t.me/AmaraFinance" target="_blank"><img src="../assets/images/telegram.png" ></a>
               <a href="https://discord.com/invite/rhkyBmmCBf" target="_blank"><img src="../assets/images/discord.png" ></a>
               <a href="https://www.amara.link/" target="_blank"><img src="../assets/images/amara.png"></a>
             </div>
             <div class="right" @click="foldMenu">
               <img src="../assets/images/fold.png" >
             </div>
           </div>
         </div>

       </div>
     </div>
     <div class="block-right" :class="{'isCollapse-w150':isCollapse}">
       <div class="topWrap">
         <div class="left_notice">
           <notice-bar :lists="noticeList" class="noticeBar"></notice-bar>
         </div>
         <div class="right_btns">
           <template>
             <el-button class="connectBtn" @click="connectBtn" v-if="!account || !isNetwork">{{connectText}}</el-button>
             <div class="accountBox" v-else>
               <div class="accountInfo">
                 <img src="../assets/images/moonbeam.png" class="logo"/>
                 <span class="accountTxt">{{accountShow}}</span>
               </div>
               <el-dropdown class="netWorkSelect">
                 <span class="">
                   Moonbase<i class="el-icon-arrow-down el-icon--right"></i>
                 </span>
                 <el-dropdown-menu slot="dropdown" >
                   <el-dropdown-item v-for="(item,index) in chainNetList" :key="index" :disabled="!item.isOline" :class="{'curNetBg':item.selected}">
                     <div class="d-flex a-center">
                       <img :src="item.logo" style="width: 22px;">
                       <span class="ml-1">{{item.name}} <span v-if="!item.isOline">({{$t('common.comingSoon')}})</span></span>
                     </div>
                     <i class="el-icon-check" v-if="item.selected" style="color: #FA05E0;"></i>
                   </el-dropdown-item>
                 </el-dropdown-menu>
               </el-dropdown>
             </div>
           </template>
           <div class="languageBox">
               <div class="item" :class="{'text-white': language == 'en'}" @click="switchLanguage('en')">
                 <span>Eng</span>
               </div>
               <div class="item" :class="{'text-white': language == 'zh-cn'}" @click="switchLanguage('zh-cn')">
                 <span>中文</span>
               </div>
               <div class="item_selected" :style="{'left': language == 'en'? 0 : '50%'}"></div>
           </div>
         </div>
         <w-popup class="popup" dialogTitle="Select a wallet provider" :dialogVisible="dialogVisible" @handleClose="handleClose">
           <div class="walletProvider" @click="connectMetaMask">
             <div class="provider_info">
               <img src="../assets/images/logo-metamask.png" class="provider_info_img">
               <span class="provider_info_name">MetaMask</span>
             </div>
             <el-button class="connectWalletBtn">Connect</el-button>
           </div>
         </w-popup>
         <notice-popup ref="noticePopup" :dialogVisible="noticeDialogVisible" @handleClose="handleNoticeClose"></notice-popup>
       </div>
       <router-view />
     </div>
   </div>
 </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import wPopup from '@/components/w-popup/w-popup.vue';
  import noticeBar from "@/components/notice-bar.vue";
  import noticePopup from '@/components/notice-popup/notice-popup.vue';
  export default {
    data() {
      return {
        isCollapse: false,
        isLinkShow: false,
        maraDialogVisible: false,
        accountDialogVisible: false,
        tableData: [],
        maraWalletBalance: 0,
        rewardBlance: 0,
        basePrice: 0,
        isLoading: false,
        bindAccount: false,
        menuIndex: 0,
        noticeList: [this.$t('common.welcome')],
        dialogVisible: false,
        noticeDialogVisible:false,
        baseTokenPrice: '',
        chainNetList: [
          {name: 'Moonbase',logo: require("../assets/images/moonbeam.png"),netWorkId: 1287,isOline:true,selected: false},
          {name: 'Moonriver',logo: require("../assets/images/moonriver.png"),netWorkId: 0,isOline:false,selected: false},
        ]
      };
    },
    components: {
      wPopup,
      noticeBar,
      noticePopup
    },
    computed: {
      ...mapState({
        account: (state) => state.Session.account,
        language: (state) => state.Session.language,
        networkVersion: (state) => state.Session.networkVersion,
        chainId: (state) => state.Session.chainId,
      }),
      accountShow() {
        if (this.account) {
          return (
            this.account.substr(0, 8) +
            "...." +
            this.account.substr(-2)
          );
        } else {
          return this.$t("common.connectWallet");
        }
      },
      isNetwork() {
      	return this.chainId == this.$envConfig.VUE_APP_NETWORK_ID;
      },
      connectText() {
      	if(this.chainId && this.chainId != this.$envConfig.VUE_APP_NETWORK_ID){
      		return this.$t('common.wrongNetwork');
      	}else{
      		return this.$t('common.connectWallet');
      	}
      },
    },
    watch: {
      account() {
        if (this.account) {
          this.getBaseTokenPrice()
        }
      },
      language(newValue,old) {
        this.noticeList[0] = this.$t('common.welcome')
      },
      $route: {
        handler: function(val, oldVal) {
          this.switchMenuByPath(val.name)
        },
        deep: true
      },
      networkVersion:{
        handler(newVal,oldVal){
          if(newVal) {
            this.chainNetList.forEach(item => {
              if(item.netWorkId == newVal) {
                item.selected = true
              }
            })
          }
        },
        immediate: true
      }
    },
    created() {

    },
    mounted() {
      this.switchMenuByPath(this.$route.name);
      setTimeout(() => {
        if(this.chainId && !this.isNetwork) {
          this.noticeDialogVisible =true
        }else {
          this.noticeDialogVisible =false
        }
      },3000)
    },
    methods: {
      handleNoticeClose(){
        this.$refs['noticePopup'].dialogVisible = false
      },
      getBaseTokenPrice() {
        this.$unitroller.getBaseTokenPrice().then((res) => {
          this.baseTokenPrice = Number(res / Math.pow(10,6)).toFixed(2)
        }).catch((err) => {console.log(err)})
      },
      foldMenu() {
        this.isCollapse = !this.isCollapse
      },
      connectBtn() {
        if(!this.isNetwork && this.chainId) {
          this.$refs['noticePopup'].dialogVisible = true
        }else {
          this.dialogVisible = true
        }
      },
      connectMetaMask() {
        ethereum.request({ method: 'eth_requestAccounts' });
        this.dialogVisible = false
      },
      handleClose(){
        this.dialogVisible = false
      },
      switchLanguage(key) {
        this.$i18n.locale = key
        this.$store.commit('CAHNGE_LANGUAGE',key)
      },
      switchMenuByPath(name) {
        switch (name) {
          case 'main':
            this.menuIndex = 0
            break;
          case 'asset':
            this.menuIndex = 1
            break;
        }
      },
      goToPage(index, path) {
        if (this.menuIndex == index) return
        this.menuIndex = index;
        this.$router.push({
          path: path
        })
      },
      copyAccount() {
        if (!this.account) return;
        document.getElementsByClassName("copytxt")[0].value = this.account;
        var url = document.getElementsByClassName("copytxt")[0];
        url.select();
        document.execCommand("Copy");
        this.$notify({
          title: 'Success',
          message: 'Account address copied',
          duration: 1200,
          type: 'success'
        });
      },
      switchMenu() {
        this.isCollapse = !this.isCollapse;
      },
    },
  };
</script>

<style lang="scss">
  .el-dropdown-menu {
    width: 280px;
    padding: 0!important;
    border: none!important;
    border-radius: 6px!important;
    background-color: #1b0649!important;
    overflow: hidden;

  }
  .el-dropdown-menu__item {
    width: 100%;
    color: #FFFFFF!important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 10px!important;
    padding: 10px 20px!important;
    box-sizing: border-box!important;
  }
  .el-dropdown-menu__item.is-disabled {
    color: #BBBBBB!important;
  }
  .curNetBg {
     background-color: rgba(249, 7, 223, 0.1)!important;
  }
  .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: rgba(249, 7, 223, .1)!important;
    color: none!important;
  }
  .el-popper .popper__arrow, .el-popper .popper__arrow::after {
    display: none!important;
  }
 .flex-col {
   display: flex;
   flex-direction: column;
 }
 .popup {
   .walletProvider {
     margin: 25px auto 0;
     padding: 30px 40px;
     box-sizing: border-box;
     display: flex;
     justify-content: space-between;
     align-items: center;
     width: 487px;
     height: 100px;
     background: rgba(80, 73, 136, 0.5);
     border-radius: 20px;
     .el-button {
       background: transparent;
     }
     .provider_info {
       display: flex;
       align-items: center;
       .provider_info_img {
         width: 37px;
       }
       .provider_info_name {
         margin-left: 20px;
         font-size: 20px;
         font-weight: 500;
         color: #FFFFFF;
       }
     }
     .connectWalletBtn {
       width: 160px;
       height: 56px;
       border-radius: 35px;
       border: 2px solid #C539C6!important;
       font-size: 20px;
       font-weight: 500;
       color: #C539C6;
     }
   }
 }
 .container {
   background-color: #1E1544;
   .isCollapse-w150 {
     width: calc(100% - 150px)!important;
   }
   .w150 {
     width: 150px!important;
   }
   .block {
     display: flex;
     justify-content: flex-end;
     .block-left {
       position: fixed;
       z-index: 999;
       left: 0;
       top: 0;
       float: left;
       padding-top: 30px;
       width: 274px;
       min-height: 100vh;
       background-image: url(../assets/images/bg-left2.png);
       background-size: 100% 100%;
       background-repeat: no-repeat;
       // background: linear-gradient(135deg, rgba(121, 24, 120, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
       // box-shadow: 2px 0px 6px 0px rgba(22, 9, 60, 0.2);
       // filter: blur(10px);
       .logo-amara {
         width: 134px;
       }
       .logo-sm-amara {
         width: 55px;
       }
       .blockTxt {
         font-size: 16px;
         font-weight: 400;
         color: #FFFFFF;
         line-height: 22px;
       }
       .curPriceTxt {
         font-size: 15px;
         font-weight: 400;
         color: #FFFFFF;
       }
       .buyBox {
         margin: 20px auto 20px;
         width: 80px;
         height: 30px;
         line-height: 30px;
         text-align: center;
         background: rgba(255, 255, 255, 0.2);
         box-shadow: 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
         border-radius: 25px;
         font-size: 14px;
       }
       .footBox {
         display: flex;
         justify-content: space-between;
         padding: 20px 25px 0 ;
         box-sizing: border-box;
         .left {
           img {
             width: 26px;
             margin-right: 13px;
           }
         }
         .right {
           cursor: pointer;
           img {
             width: 24px;
           }
         }
       }
       .followTxt {
         font-size: 16px;
         font-weight: 500;
         color: rgba(255, 255, 255, 0.5);
         line-height: 22px;
       }
       .menu-box.isCollapse .menu-item .menu-title {
         display: none!important;
       }


       .menu-box {
         margin-top: 30px;
         position: relative;
         border: none;
         .hoverBg {
           position: absolute;
         }
         .divide {
           margin: 20px auto;
           width: 96%;
           height: 1px;
           background: rgba(255, 255, 255, 0.1);
           box-shadow: 1px 1px 4px 0px rgba(12, 4, 46, 0.5);
         }
         .menu-item {
           text-align: left;
           display: flex;
           align-items: center;
           padding-left: 60px;
           cursor: pointer;
           box-sizing: border-box;
           height: 60px;
           font-size: 16px;
           font-weight: 500;
           color: #9e9e9e;
          .menu-title-faq {
            color: #9e9e9e;
            text-decoration: none;

          }
           .meun-icon {
             display: inline-block;
             margin-right: 20px;
             width: 24px;
             height: 24px;
             background-size: 100%;
             background-repeat: no-repeat;
             display: inline-block;
             flex: none;
           }

           .iconbox1 {
             background-image: url(../assets/images/market.png);
           }
           .iconbox2 {
             background-image: url(../assets/images/assets.png);
           }
           .iconbox3 {
             background-image: url(../assets/images/stake.png);
           }
           .iconbox4 {
             background-image: url(../assets/images/maralink.png);
           }
           .iconbox5 {
             background-image: url(../assets/images/nft.png);
           }
           .iconbox6 {
             background-image: url(../assets/images/dao.png);
           }
           .iconbox7 {
             background-image: url(../assets/images/faq.png);
           }
         }

         .menu-item.active,
         .menu-item:focus,
         .menu-item:hover {
           color: #ffffff;
            .menu-title-faq {
              color: #FFFFFF;
            }
           .el-tooltip i {
             color: #ffffff;
             background-color: var(--primary);
           }

           .iconbox1 {
             background-image: url(../assets/images/market-s.png);
           }

           .iconbox2 {
             background-image: url(../assets/images/assets-s.png);
           }

           .iconbox3 {
             background-image: url(../assets/images/stake-s.png);
           }

           .iconbox4 {
             background-image: url(../assets/images/maralink-s.png);
           }

           .iconbox5 {
             background-image: url(../assets/images/nft-s.png);
           }

           .iconbox6 {
             background-image: url(../assets/images/dao-s.png);
           }
           .iconbox7 {
             background-image: url(../assets/images/faq-s.png);
           }
         }
       }
       .div-vertical:not(.div--collapse) {
         width: 100%;
       }
     }
      .bottom-box {
        position: absolute;
        bottom: 40px;
      }
     .block-right {
       width: calc(100% - 274px);
       padding: 40px 54px;
       min-height: 100vh;
       box-sizing: border-box;
       background-image: url(../assets/images/bg-mm2.png);
       background-size: 60% auto;
       background-repeat: no-repeat;
       background-position: center;
       .topWrap {
         width: 100%;
         display: flex;
         justify-content: space-between;
         .left_notice {
           width: 50%;
           .noticeBar {
             width: 88%;
             height: 48px;
             line-height: 48px;
             text-align: center;
             background: linear-gradient(135deg, rgba(228, 151, 227, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
             box-shadow: 8px 8px 12px 0px rgba(19, 30, 113, 0.5);
             border: 2px solid rgba(255, 255, 255, 0.2);
             border-radius: 10px;
             //border-image: linear-gradient(162deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.2)) 2 2;
             box-sizing: border-box;
             //backdrop-filter: blur(10px);
           }
         }
         .right_btns {
           width: 50%;
           display: flex;
           align-items: center;
           justify-content: flex-end;
           .connectBtn {
             width: 270px;
             height: 48px;
             background: linear-gradient(90deg, #DD32BA 0%, #6150F2 100%);
             box-shadow: 1px 1px 2px 0px rgba(189, 29, 164, 0.5), 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
             border-radius: 24px;
             color: #FFFFFF;
           }
           .accountBox {
             display: flex;
             // width: 36%;
             height: 48px;
             background: #7800FF;
             box-shadow: 1px 1px 2px 0px rgba(66, 4, 117, 0.5), 0px 1px 3px 0px rgba(0, 0, 0, 0.5);
             border-radius: 24px;
             .accountInfo {
               // width: 135px;
               display: flex;
               align-items: center;
               padding: 20px;
               box-sizing: border-box;
               background: linear-gradient(90deg, #DD32BA 0%, #6150F2 100%);
               box-shadow: 1px 1px 2px 0px rgba(66, 4, 117, 0.5), 0px 1px 3px 0px rgba(255, 255, 255, 0.5);
               border-radius: 24px;
               .logo {
                 width: 24px;
               }
               .accountTxt {
                 margin-left: 10px;
                 font-size: 12px;
                 font-weight: 500;
                 color: rgba(255, 255, 255, 0.7);
                 text-shadow: 1px 1px 2px rgba(66, 4, 117, 0.5);
               }
             }
             .netWorkSelect {
               // width: 45%;
               padding: 0 20px;
               flex: 1;
               display: flex;
               align-items: center;
               justify-content: center;
               font-size: 14px;
               color: #FFFFFF;
               cursor: pointer;
             }
           }
           .languageBox {
             position: relative;
             display: flex;
             margin-left: 42px;
             width: 25%;
             height: 40px;
             line-height: 40px;
             background: linear-gradient(135deg, rgba(228, 151, 227, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
             box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.5);
             border-radius: 10px;
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
               width: 50%;
               height: 40px;
               background: linear-gradient(135deg, rgba(228, 151, 227, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
               border: 1px solid rgba(255, 255, 255, 0.2);
               border-radius: 10px;
               transition: all .3s;
               box-sizing: border-box;
             }
           }

         }
       }
     }
   }
 }


</style>

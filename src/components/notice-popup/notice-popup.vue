<template>
  <div>
    <w-popup :dialogVisible="dialogVisible" :dialogTitle="$t('notice.title')" size="small" class="noticePop" @handleClose="handleClose">
      <div class="d-flex flex-column a-center">
        <img src="../../assets/images/info.png" class="infoImg">
        <span class="infoContent">{{$t('notice.content')}}</span>
        <el-button class="btn-notice">{{$t('notice.buttonText')}} <a href="javascript:void(0);" class="netLink" @click="connectMainNet">Moonbase Alpha?</a></el-button>
      </div>
    </w-popup>
  </div>
</template>

<script>
  import wPopup from '@/components/w-popup/w-popup.vue';
  export default {
    components:{
      wPopup
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
    },
    methods: {
      async connectMainNet(){
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x507' }],
          })
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{ chainId: '0x507', rpcUrl: 'https://rpc.testnet.moonbeam.network' /* ... */ }],
              });
            } catch (addError) {
              // handle "add" error
            }
          }
          // handle other "switch" errors
        }
      },
      handleClose() {
        this.$emit('handleClose')
      }
    }
  }
</script>

<style lang="scss">
  .noticePop {
    .infoImg {
      width: 176px;
      margin-top: 35px;
    }
    .infoContent {
      margin-top: 25px;
      font-size: 16px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22px
    }
    .btn-notice {
      margin-top: 40px;
      width: 330px;
      height: 50px;
      background: linear-gradient(160deg, #DC19C1 0%, #121FF0 100%);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5), 2px 2px 20px 0px rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 20px;
    }
    .netLink {
      color: #FF00C4;
    }

  }
</style>

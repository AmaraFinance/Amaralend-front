<template>
  <div class="w-popup">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible"   center :before-close="handleClose" :width="size == 'small' ? '548px':'600px'">
      <div class="content">
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'w-popup',
    props: {
      dialogVisible: {
        type: Boolean,
        default: false
      },
      dialogTitle: {
        type: String
      },
      size: {
        type:String,
      }
    },
    methods: {
      handleClose() {
        this.$emit('handleClose')
      }
    }
  }
</script>

<style lang="scss">
  .w-popup {
    // .el-dialog {
    //   width: 548px;
    // }

    .el-dialog, .el-pager li{
      border-radius: 20px;
      background: linear-gradient(224deg, #171544 0%, #502F87 100%);
      box-shadow: 4px 4px 6px 0px rgba(12, 32, 50, 0.4);
      border-radius: 20px;
    }
    .el-dialog__header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70px;
      padding: 20px;
      box-sizing: border-box;
      background: #1F194D;
      box-shadow: 0px 2px 8px 0px #07002E;
      border-radius: 20px 20px 0px 0px;
    }
    .el-dialog__title {
      line-height: 0;
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
    }
    .el-icon-close:before {
      content: "";
    }

    .el-dialog__headerbtn {
      z-index: 9;
      top: 20px;
      right: 30px;
      width: 30px;
      height: 30px;
      background-image: url(../../assets/images/close.png);
      background-size: 100%;
      background-repeat: no-repeat;
    }

    .content {
      padding: 0 20px;
      box-sizing: border-box;
    }

  }

</style>

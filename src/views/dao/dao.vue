<template>
  <div>
    <div class="box">
      <img src="../../assets/images/empty.png" >
      <span>{{$t('dao.coming')}}</span>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss">
  .box {
    margin-top: -42px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 268px;
    }
    span {
      margin-top: 20px;
      font-size: 32px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #597692;
      line-height: 45px;
    }
  }
</style>

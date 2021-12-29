<template>
  <div class="wrap">
    <img src="../assets/images/broadcast.png" class="broadcast">
    <div class="marqueeWrap">
      <ul id="marquee">
        <li v-for="(item,index) in lists" :key="index">{{item}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
  export default {
    name: "noticeBar",
    props: ["lists"],
    methods: {
      move() {
        let width = document.getElementById("marquee").scrollWidth - 55;
        let marquee = document.getElementById("marquee");
        let speed = 10;
        setInterval(function() {
          speed = speed - 1;
          if (-speed >= width) {
            speed = width;
          }
          marquee.style.transform = "translateX(" + speed + "px)";
        }, 40);
      }
    },
    mounted: function() {
      this.move();
    }
  };
</script>

<style lang="scss">
  .wrap {
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    padding-left: 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    .broadcast {
      width: 20px;
      height: 20px;
    }
    .marqueeWrap {
      overflow: hidden;

      ul,
      li {
        margin: 0;
        padding: 0;
      }

      ul {
        white-space: nowrap;
        margin: 0 10px;
      }

      li {
        height: 100%;
        list-style: none;
        margin-right: 10px;
        display: inline-block;
      }

      
    }
  }

  #box {
    height: 100%;
  }
</style>

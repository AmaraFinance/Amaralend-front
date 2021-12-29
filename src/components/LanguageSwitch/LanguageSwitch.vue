<template>
  <el-menu ref="elMenu" :default-active="activeIndex" @select="handleSelect" class="el-menu--vs
             language-switch " @open="handleOpen" menu-trigger="hover" :mode="mode">
    <el-submenu :popper-class="
          `vs-submenu vs-submenu--left vs-submenu__language ${popperClass}`
        " index="vs">
      <template slot="title">
        <!-- <svg-icon icon-class="language" style="margin-right:5px;" ></svg-icon> -->
        <span class="currentLocaleClass"> {{ currentLocale.label }}</span>
      </template>
      <el-menu-item v-for="item in locales" :index="item.key" :key="item.key" style="color: #666666!important;">
        {{ item.label }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: 'LanguageSwitch',
    props: {
      mode: {
        type: String,
        default: 'vertical'
      },
      popperClass: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        key: '',
        activeIndex: 'z-h',
        locales: [{
            key: 'zh-cn',
            label: '中文',
            icon: 'ZH'
          },
          {
            key: 'en',
            label: 'English',
            icon: 'EN'
          }
        ]
      }
    },
    computed: {
      localeByKey() {
        return this.locales.reduce((pre, cur) => {
          pre[cur.key] = cur
          return pre
        }, {})
      },
      currentLocale() {
        return this.localeByKey[this.$i18n.locale] || {}
      },
    },
    methods: {
      handleOpen(key, keyPath) {
        this.key = key
      },
      handleSelect(key) {
        this.$i18n.locale = key
        this.$refs.elMenu.close(this.key)
        this.$store.commit('CAHNGE_LANGUAGE',key)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .national-flag {
    font-size: 16px;
    margin-right: 10px;
  }

  .language-switch {
    /deep/ .el-submenu {
      width: 100%;
    }

    /deep/ .el-submenu__title {
      font-size: 20px !important;
      color: #333333;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 !important;
      // @include res(xs) {
      //   justify-content: flex-start;
      // }
    }

    .currentLocaleClass {
      color: #666666 !important;

      &:hover {
        color: (--primary) !important;
      }
    }
  }
</style>
<style lang="scss">
  .vs-submenu__language {
    margin-left: 20px;

    // @include res(xs) {
    //   margin-left: auto;
    // }
  }
</style>

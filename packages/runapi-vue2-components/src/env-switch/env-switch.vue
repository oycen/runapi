<template>
  <section ref="envSwitch" class="switch-container">
    <div class="switch-fab action" @click.prevent.stop="showFabs = !showFabs">
      {{ requestor.env ? requestor.env.toLocaleUpperCase() : "ENV" }}
      <div v-show="showFabs" class="switch-fabs">
        <div v-for="(env, idx) in Object.keys(requestor.requestEnv)" :key="idx" class="switch-fab" @click="handleSwitch(env)">
          {{ env.toLocaleUpperCase() }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { REQUEST_ENV_CACHE_KEY } from ".";

export default {
  props: {
    requestor: {
      require: true,
    },
    move: {
      type: Boolean,
      default: true,
    },
    reload: {
      type: [Boolean, Function],
      default: true,
    },
  },
  data() {
    return {
      box: {
        x: 0,
        y: 0,
        l: 0,
        t: 0,
        isDown: false,
      },
      showFabs: false,
    };
  },
  mounted() {
    this.makeMove();
  },
  methods: {
    makeMove() {
      const that = this;

      //获取元素
      const ele = that.$refs.envSwitch;
      that.box.isDown = false;
      ele.style.cursor = "pointer";

      if (!that.move) return;

      //鼠标按下事件
      ele.onmousedown = function (e) {
        //获取x坐标和y坐标
        that.box.x = e.clientX;
        that.box.y = e.clientY;

        //获取左部和顶部的偏移量
        that.box.l = ele.offsetLeft;
        that.box.t = ele.offsetTop;
        //开关打开
        that.box.isDown = true;
        //设置样式
        ele.style.cursor = "move";
      };

      //鼠标抬起事件
      ele.onmouseup = function () {
        //开关关闭
        that.box.isDown = false;
        ele.style.cursor = "pointer";
      };

      //鼠标移动
      window.onmousemove = function (e) {
        if (!that.box.isDown) return;

        //获取x和y
        const nx = e.clientX;
        const ny = e.clientY;

        //计算移动后的左偏移量和顶部的偏移量
        const nl = nx - (that.box.x - that.box.l);
        const nt = ny - (that.box.y - that.box.t);

        const iw = window.innerWidth;
        const ih = window.innerHeight;
        const ew = ele.getBoundingClientRect().width;
        const eh = ele.getBoundingClientRect().height;
        const nr = iw - nl - ew;
        const nb = ih - nt - eh;
        ele.style.right = nr + "px";
        ele.style.bottom = nb + "px";
      };
    },
    handleSwitch(env) {
      this.requestor.switch(env);
      window && window.localStorage.setItem(REQUEST_ENV_CACHE_KEY, env);
      this.$emit("switch", env);

      this.showFabs = false;

      if (typeof this.reload === "boolean") {
        window && this.reload && window.location.reload();
      } else if (typeof this.reload === "function") {
        this.reload();
      }
    },
  },
};
</script>

<style scoped>
.switch-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}
.switch-fab.action {
  position: relative;
  margin-bottom: 0;
}
.switch-fabs {
  display: flex;
  flex-direction: column-reverse;
  position: absolute;
  right: 0;
  bottom: 40px;
}
.switch-fab {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  height: 40px;
  color: #fff;
  background: rgba(0, 0, 0, 1);
  border-radius: 3px;
  opacity: 0.2;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: bold;
  user-select: none;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  padding: 5px;
}

.switch-fab:hover,
.switch-fab:focus {
  opacity: 0.6;
  transform: scale(1.15);
}
.switch-fab:active {
  opacity: 0.8;
}
</style>

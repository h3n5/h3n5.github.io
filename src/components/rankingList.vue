<template>
  <div class="songList">
    <div class="imgBox">
      <img v-lazy="song.coverImgUrl">
    </div>
    <div class="wordBox">
      <p
        class="top"
        v-for="(item, index) in song.tracks"
        :key="index"
      >{{index+1}}.{{item.first}} - {{item.second}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "songList",
  props: {
    song: {
      type: Object,
      default: () => {
        return {
          name: "",
          playCount: 0,
          picUrl: ""
        };
      }
    }
  },
  data() {
    return {};
  },

  methods: {
    countNumber(number) {
      if (number > 100000) {
        return (
          parseInt(number)
            .toString()
            .slice(0, -4) + "万"
        );
      } else {
        return ~~number;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.ellipsis(@num) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: @num;
}
.eliOne() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.songList {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 10px;
  width: 100%;
  .imgBox {
    position: relative;
    flex: 0 0 35%;
    &::before {
      content: "";
      display: inline-block;
      padding-bottom: 100%;
      width: 0.1px;
      vertical-align: middle;
    }
    span {
      position: absolute;
      top: 5px;
      right: 5px;
      color: #ddd;
      font-size: 12px;
    }
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      border-radius: 5px;
    }
  }
  .wordBox {
    height: 100%;
    flex: 0 0 65%;
    p {
      padding: 5px;
      height: calc(100% / 3);
      display: flex;
      margin-left: 10px;
      width: 200px;
      .eliOne()
    }
  }
}
</style>

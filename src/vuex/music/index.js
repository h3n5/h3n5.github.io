import { getSongUrl, getLyric, getsongAlbum } from '@/api/api'
import Lyric from '@/lyric'
export default {
  namespaced: true,
  state: {
    audio: {
      id: 0,
      name: '歌曲名称',
      artists: [],
      albumPic: '@/assets/play/player-bar.png',
      location: '',
      album: {}
    },
    playType: 3, // 歌单列表播放方式:1,歌单循环;2,歌单随机;3,单曲循环
    lyricTxt: '', //歌词
    lyricTxtCN: '', //中文歌词
    lyricObj: {}, //歌词
    currentIndex: 0, // 当前播放的歌曲位置
    playing: false, // 播放状态:true,播放;false,暂停
    loading: false, // 是否正在加载中
    showDetail: false, // 显示详细
    songList: [], // 播放歌单列表
    currentTime: 0,
    isCurrentTime: true,
    tmpCurrentTime: 0,
    durationTime: 0,
    bufferedTime: 0,
    change: false, // 判断是更改的时间还是播放的时间
    search: 'and i am home' //搜索词
  },
  getters: {},
  mutations: {
    switchType(state) {
      const map = new Map([
        [
          1,
          state => {
            state.playType++
          }
        ],
        [
          2,
          state => {
            state.playType++
          }
        ],
        [
          3,
          state => {
            state.playType = 1
          }
        ]
      ])
      map.get(state.playType)(state)
    },
    prev(state) {
      state.currentIndex === 0 ? (state.currentIndex = state.songList.length - 1) : state.currentIndex--
    },
    next(state) {
      state.currentIndex === state.songList.length - 1 ? (state.currentIndex = 0) : state.currentIndex++
    },
    updateMessage(state, value) {
      state.search = value
    },
    play(state) {
      state.playing = true
      document.querySelector('#audioPlay').play()
    },
    pause(state) {
      state.playing = false
      document.querySelector('#audioPlay').pause()
    },
    togglePlay(state) {
      state.playing = !state.playing
    },
    setLocation(state, value) {
      state.audio.location = value
    },
    setLrc(state, value) {
      state.lyricTxt = value
    },
    setLrcCN(state, value) {
      state.lyricTxtCN = value
    },
    setLrcObj(state, value) {
      state.lyricObj = value
    },
    setAudio(state) {
      state.audio = state.songList[state.currentIndex]
    },
    setcurrentTime(state, value) {
      state.currentTime = value
    },
    setdurationTime(state, value) {
      state.durationTime = value
    },
    setAlbumUrl(state, value) {
      state.audio.albumPic = value
    },
    setisCurrentTime(state, value) {
      state.isCurrentTime = value
    },
    //私有方法
    _PlayAndAddTolist(state, song) {
      if (state.songList.length === 0) {
        state.songList.push(song)
      }
      // 检测歌曲重复
      let flag = true
      for (let i = 0; i < state.songList.length; i++) {
        const v = state.songList[i]
        if (v.id === song.id) {
          state.currentIndex = i
          flag = false
          break
        }
      }
      if (flag) {
        state.songList.push(song)
        state.currentIndex = state.songList.length - 1
      }
    },
    _AddTolist(state, songList = []) {
      if (songList.length === 0) {
        return
      }
      state.songList = []
      state.songList = songList
      state.currentIndex = 0
    }
  },
  actions: {
    async getListPlay({ state, commit, dispatch }) {
      await commit('setAudio') //添加到播放对象
      let song = state.songList[state.currentIndex]
      Promise.all([dispatch('getSong', song.id), dispatch('getLrc', song.id), dispatch('getAlbum', song.album.id)])
    },
    async AddAndPlay({ commit, dispatch }, song) {
      await commit('_PlayAndAddTolist', song) //添加到列表
      await commit('setAudio') //添加到播放对象
      let al = song.album || song.al
      Promise.all([dispatch('getSong', song.id), dispatch('getLrc', song.id), dispatch('getAlbum', al.id)])
    },
    async AddAndPalyAll({ commit, dispatch }, songList) {
      await commit('_AddTolist', songList) //添加到列表
      if (songList[0]) {
        let song = songList[0]
        await commit('setAudio') //添加到播放对象
        Promise.all([dispatch('getSong', song.id), dispatch('getLrc', song.id), dispatch('getAlbum', song.album.id)])
      }
    },
    async getSong({ commit }, id) {
      let res = await getSongUrl(id)
      let url = res.data.data[0].url
      // commit('setLocation', url)
      commit('play', url)
    },
    async getAlbum({ commit }, id) {
      let res = await getsongAlbum(id)
      let url = res.data.album.blurPicUrl
      commit('setAlbumUrl', url)
    },
    async getLrc({ state, commit }, id) {
      commit('setLrc', '加载中。。')
      let res = await getLyric(id)
      if (res.data.nolyric) {
        commit('setLrc', '(⊙０⊙) 暂无歌词')
      } else {
        commit('setLrc', res.data.lrc.lyric)
      }
      if (!res.data.nolyric || (res.data.tlyric && res.data.tlyric.lyric)) {
        commit('setLrcCN', res.data.tlyric.lyric)
      } else {
        commit('setLrcCN', '')
      }
      console.log('初始化歌词')
      let lycObj = new Lyric(state.lyricTxt, state.lyricTxtCN)
      commit('setLrcObj', lycObj)
    }
  }
}

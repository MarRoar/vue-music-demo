import {playMode} from "common/js/config";
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  Model: playMode.sequence,
  currentIndex: -1,
}

export default state

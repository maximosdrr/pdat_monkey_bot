import { config } from "dotenv";

config({ path: ".env" });

export const AppConfig = {
  botToken: process.env.BOT_TOKEN,
  riotApiKey: process.env.RIOT_API_KEY,
  brRiotBaseUrl: process.env.BR_RIOT_GAMES_BASE_URL,
  defaultSong: process.env.DEFAULT_SONG,
  whiteList: process.env.WHITE_LIST,

  commands: {
    prefix: process.env.BOT_PREFIX,
    lolRank: process.env.LOL_RANK,
    addSummoner: process.env.ADD_SUMMONER,
    listSummoner: process.env.LIST_SUMMONERS,
    deleteSummoner: process.env.DELETE_SUMMONER,
    playMusic: process.env.PLAY_MUSIC,
    skipMusic: process.env.SKIP_MUSIC,
    stopMusic: process.env.STOP_MUSIC,
    playYoutubePlaylist: process.env.PLAY_YOUTUBE_PLAYLIST,
    getQueueSongs: process.env.GET_QUEUE_SONGS,
    help: process.env.GET_HELP,
    shuffle: process.env.SHUFFLE_QUEUE,
  },
};

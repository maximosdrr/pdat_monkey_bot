import { AppConfig } from "./config/env";
import { SongPlayer } from "./modules/music-player/helpers/song-player";
import { VideoDetailsSeeker } from "./libs/video-details-seeker";
import { YoutubeSearch } from "./libs/youtube-search";
import { YoutubeStreamProvider } from "./libs/youtube-stream-provider";
import { GetHelp } from "./modules/bot-info/actions/help";
import { LolRankAddGuildPlayer } from "./modules/lol-rank/actions/add-summoner";
import { LolRankListPlayers } from "./modules/lol-rank/actions/list-summoners";
import { GuildLeagueOfLegendsRank } from "./modules/lol-rank/actions/lol-rank";
import { LolRankRemoveGuildPlayer } from "./modules/lol-rank/actions/remove-summoner";
import { RiotGamesRepository } from "./modules/lol-rank/repositories/riot-games/riot-games.repository";
import { SummonerRepository } from "./modules/lol-rank/repositories/summoner/summoner.repository";
import { RankBuilder } from "./modules/lol-rank/utils/build-rank.helper";
import { PlayMusic } from "./modules/music-player/actions/play";
import { SongQueue } from "./modules/music-player/helpers/queue";
import { SongFinder } from "./modules/music-player/helpers/song-finder";
import { VoiceManager } from "./modules/music-player/helpers/voice-manager";
import { LolRankMessageFormatter } from "./modules/lol-rank/utils/lol-rank-message-formatter";
import { ListSummonerMessageFormatter } from "./modules/lol-rank/utils/list-summoner-formatter";
import { StopMusic } from "./modules/music-player/actions/stop";
import { SkipMusic } from "./modules/music-player/actions/next";
import { GetQueueInfo } from "./modules/music-player/actions/get-queue-info";
import { PlayYoutubePlayList } from "./modules/music-player/actions/play-list/play-list.action";
import { ShuffleQueue } from "./modules/music-player/actions/shuffle";

const prefix = AppConfig.commands.prefix;
const commands = AppConfig.commands;
const videoDetailsSeeker = new VideoDetailsSeeker();
const youtubeSearch = new YoutubeSearch();
const youtubeStreamProvider = new YoutubeStreamProvider();
const voiceManager = new VoiceManager();
const songQueue = new SongQueue();
const songFinder = new SongFinder(videoDetailsSeeker, youtubeSearch);
const summonerRepository = new SummonerRepository();
const riotRepository = new RiotGamesRepository();
const rankBuilder = new RankBuilder(riotRepository);
const lolRankMessageFormatter = new LolRankMessageFormatter();
const listSummonerMessageFormatter = new ListSummonerMessageFormatter();

const songPlayer = new SongPlayer(
  songQueue,
  youtubeStreamProvider,
  voiceManager
);

const Actions = [
  new GetHelp(`${prefix}${commands.help}`),
  new StopMusic(`${prefix}${commands.stopMusic}`, songPlayer),
  new SkipMusic(`${prefix}${commands.skipMusic}`, songPlayer),
  new GetQueueInfo(`${prefix}${commands.getQueueSongs}`, songQueue),
  new PlayMusic(`${prefix}${commands.playMusic}`, songFinder, songPlayer),
  new LolRankAddGuildPlayer(
    `${prefix}${commands.addSummoner}`,
    summonerRepository
  ),
  new LolRankListPlayers(
    `${prefix}${commands.listSummoner}`,
    summonerRepository,
    listSummonerMessageFormatter
  ),

  new LolRankRemoveGuildPlayer(
    `${prefix}${commands.deleteSummoner}`,
    summonerRepository
  ),
  new GuildLeagueOfLegendsRank(
    `${prefix}${commands.lolRank}`,
    summonerRepository,
    rankBuilder,
    lolRankMessageFormatter
  ),
  new PlayYoutubePlayList(
    `${prefix}${commands.playYoutubePlaylist}`,
    songPlayer,
    songFinder,
    songQueue
  ),
  new ShuffleQueue(`${prefix}${commands.shuffle}`, songQueue),
];

export default Actions;

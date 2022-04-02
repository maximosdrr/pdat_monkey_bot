import { GuildLeagueOfLegendsRank } from "./lol-rank/action";
import { LolRankAddGuildPlayer } from "./add-summoner/action";
import { LolRankListPlayers } from "./list-summoners/action";
import { LolRankRemoveGuildPlayer } from "./remove-summoner/action";
import { PlayMusic } from "./play-music/action";
import { AppConfig } from "../../config/env";
import { GetHelp } from "./help/action";

const prefix = AppConfig.commands.prefix;
const commands = AppConfig.commands;

const Actions = [
  new GuildLeagueOfLegendsRank(`${prefix}${commands.lolRank}`),
  new LolRankAddGuildPlayer(`${prefix}${commands.addSummoner}`),
  new LolRankListPlayers(`${prefix}${commands.listSummoner}`),
  new LolRankRemoveGuildPlayer(`${prefix}${commands.deleteSummoner}`),
  new PlayMusic({
    play: `${prefix}${commands.playMusic}`,
    next: `${prefix}${commands.skipMusic}`,
    stop: `${prefix}${commands.stopMusic}`,
    getQueueSongs: `${prefix}${commands.getQueueSongs}`,
  }),
  new GetHelp(`${prefix}${commands.help}`),
];

export default Actions;

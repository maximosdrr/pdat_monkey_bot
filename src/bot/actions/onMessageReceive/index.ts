import { GuildLeagueOfLegendsRank } from "./lol-rank/guild-lol-rank.action";
import { LolRankAddGuildPlayer } from "./lol-rank/sub-actions/add-guild-player/add-guild-player";
import { LolRankListPlayers } from "./lol-rank/sub-actions/add-guild-player/list-players";
import { LolRankRemoveGuildPlayer } from "./lol-rank/sub-actions/add-guild-player/remove-guild-player";

const Actions = [
  new GuildLeagueOfLegendsRank("@lolRank"),
  new LolRankAddGuildPlayer("@addSummoner"),
  new LolRankListPlayers("@listSummoners"),
  new LolRankRemoveGuildPlayer("@deleteSummoner"),
];

export default Actions;

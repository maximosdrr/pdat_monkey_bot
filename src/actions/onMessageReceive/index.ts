import { GuildLeagueOfLegendsRank } from "./lol-rank/action";
import { LolRankAddGuildPlayer } from "./add-summoner/action";
import { LolRankListPlayers } from "./list-summoners/action";
import { LolRankRemoveGuildPlayer } from "./remove-summoner/action";
import { PlayMusic } from "./play-music/action";

const Actions = [
  new GuildLeagueOfLegendsRank("@lolRank"),
  new LolRankAddGuildPlayer("@addSummoner"),
  new LolRankListPlayers("@listSummoners"),
  new LolRankRemoveGuildPlayer("@deleteSummoner"),
  new PlayMusic({ play: "@play", skip: "@skip", stop: "@stop" }),
];

export default Actions;

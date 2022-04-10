import {
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";

export interface ISong {
  title: string;
  url: string;
  duration: number;
}

export type ChannelText =
  | TextChannel
  | DMChannel
  | PartialDMChannel
  | NewsChannel
  | ThreadChannel;

import { AppConfig } from "../../../config/env";
import { ISong } from "../interfaces/interfaces";
import { VideoDetailsSeeker } from "../../../libs/video-details-seeker";
import { YoutubeSearch } from "../../../libs/youtube-search";
import { IVideoDetails } from "../../../libs/video-details-seeker/interfaces";

export class SongFinder {
  constructor(
    private videoDetailsSeeker: VideoDetailsSeeker,
    private youtubeSearch: YoutubeSearch
  ) {}

  async getSong(searchTerm: string): Promise<ISong> {
    try {
      const songUrl = await this.getSongUrl(searchTerm);
      const songInfo = await this.videoDetailsSeeker.getInfo(songUrl);

      const songDuration = this.getSongDuration(songInfo);
      return {
        url: songUrl,
        title: songInfo?.videoDetails?.title ?? "NOT FOUND",
        duration: songDuration,
      };
    } catch (e) {
      throw new Error(
        `Cannot add this song to queue reason ${e.message ?? "Unknown"}`
      );
    }
  }

  async getPlaylistSongs(link: string): Promise<ISong[]> {
    try {
      const videos = await this.youtubeSearch.getPlaylist(link);
      const songs: ISong[] = [];

      for (const video of videos) {
        songs.push({
          duration: video.durationInSec,
          title: video.title,
          url: video.url,
        });
      }

      return songs;
    } catch (e) {
      throw new Error(
        `Cannot find this play list, reason: ${e.message ?? "Unknown"}`
      );
    }
  }

  private getSongDuration(details: IVideoDetails) {
    const seconds = Number(details?.videoDetails?.lengthSeconds);

    if (Number.isNaN(seconds)) {
      return 1;
    }

    return seconds;
  }

  private async getSongUrl(searchTerm: string): Promise<string> {
    if (this.isYoutubeUrl(searchTerm)) {
      return searchTerm;
    }

    const result = await this.youtubeSearch.search(searchTerm);

    for (const song of result.videos) {
      const { url } = song;

      if (!url) return AppConfig.defaultSong;

      return url;
    }
  }

  private isYoutubeUrl(song: string): boolean {
    const result = this.videoDetailsSeeker.validateURL(song);
    return result;
  }
}

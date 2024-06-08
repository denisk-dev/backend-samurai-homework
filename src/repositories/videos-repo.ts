import { v4 as uuidv4 } from "uuid";

export enum Resolution {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160",
}

export interface Video {
  id: ReturnType<typeof uuidv4>;
  title: string;
  author: string;
  availableResolutions: Array<Resolution>;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: Date;
  publicationDate: Date;
}

export let videos: Array<Video> = [
  // {
  //   id: "425b03f9-a08f-4f36-a350-a3a2860fa819",
  //   title: "Video 1",
  //   author: "Author 1",
  //   canBeDownloaded: true,
  //   minAgeRestriction: 18,
  //   createdAt: new Date(),
  //   publicationDate: new Date(),
  //   availableResolutions: [Resolution.P1080, Resolution.P720, Resolution.P480],
  // },
];

export const videoRepository = {
  create(video: Video) {
    if (video) {
      videos.push(video);
      return true;
    } else {
      return false;
    }
  },

  findById(id: string) {
    return videos.find((video) => video.id === id);
  },

  findAll() {
    return videos;
  },

  deleteById(id: string) {
    const videoIndex = videos.findIndex((video) => video.id === id);
    if (videoIndex !== -1) {
      videos.splice(videoIndex, 1);
      return true;
    } else {
      return false;
    }
  },

  updateById(id: string, video: Video) {
    const videoIndex = videos.findIndex((video) => video.id === id);
    if (videoIndex !== -1) {
      videos[videoIndex] = video;
      return true;
    } else {
      return false;
    }
  },

  deleteAll() {
    videos = [];
  },
};

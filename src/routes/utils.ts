import { Video } from "../repositories/videos-repo";

export const convertVideosDatesToISO = (videos: Array<Video>) =>
  videos.map((video) => ({
    ...video,
    createdAt: video.createdAt.toISOString(),
    publicationDate: video.publicationDate.toISOString(),
  }));

export const convertVideoDatesToISO = (video: Video) => ({
  ...video,
  createdAt: video.createdAt.toISOString(),
  publicationDate: video.publicationDate.toISOString(),
});

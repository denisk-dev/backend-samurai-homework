import { convertVideosDatesToISO, convertVideoDatesToISO } from "./utils";
import { Video, Resolution } from "../index";

describe("Utils", () => {
  it("should convert video dates to ISO format", () => {
    const video: Video = {
      id: "425b03f9-a08f-4f36-a350-a3a2860fa819",
      title: "Test Video",
      author: "Test Author",
      availableResolutions: [Resolution.P720, Resolution.P1080],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: new Date(),
      publicationDate: new Date(),
    };

    const convertedVideo = convertVideoDatesToISO(video);

    expect(convertedVideo.createdAt).toEqual(video.createdAt.toISOString());
    expect(convertedVideo.publicationDate).toEqual(
      video.publicationDate.toISOString()
    );
  });

  it("should convert dates to ISO format for all videos in an array", () => {
    const videos: Array<Video> = [
      {
        id: "425b03f9-a08f-4f36-a350-a3a2860fa819",
        title: "Test Video 2",
        author: "Test Author 2",
        availableResolutions: [Resolution.P720, Resolution.P1080],
        canBeDownloaded: true,
        minAgeRestriction: 18,
        createdAt: new Date(),
        publicationDate: new Date(),
      },
    ];

    const convertedVideos = convertVideosDatesToISO(videos);

    convertedVideos.forEach((video, index) => {
      expect(video.createdAt).toEqual(videos[index].createdAt.toISOString());
      expect(video.publicationDate).toEqual(
        videos[index].publicationDate.toISOString()
      );
    });
  });
});
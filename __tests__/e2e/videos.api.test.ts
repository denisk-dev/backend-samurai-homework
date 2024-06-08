import request from "supertest";
import { app } from "../../src/index"; // Import your express app
// import { v4 as uuidv4, validate } from "uuid";

describe("videosRouter", () => {
  let videoId: number;

  // Test for POST endpoint
  it("should create a new video and return it", async () => {
    const video = {
      title: "Test Video",
      author: "Test Author",
      availableResolutions: ["P720", "P1080"],
    };

    const response = await request(app).post("/videos").send(video);

    videoId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      title: video.title,
      author: video.author,
      availableResolutions: video.availableResolutions,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  // Test for POST endpoint
  it("should fail to create a new video and return 400 with error message", async () => {
    const video = {
      availableResolutions: ["P720", "P1080"],
    };

    const response = await request(app).post("/videos").send(video);

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      errorsMessages: [
        {
          message: "problem with the title field",
          field: "title",
        },
        {
          message: "problem with the author field",
          field: "author",
        },
      ],
    });
  });

  // Test for GET endpoint to fetch all videos
  it("should fetch all videos and return status 200", async () => {
    const response = await request(app).get("/videos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toMatchObject([
      {
        id: expect.any(Number),
        title: "Test Video",
        author: "Test Author",
        availableResolutions: ["P720", "P1080"],
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
      },
    ]);
  });

  // Test for GET endpoint when video is not found
  it("should return status 404 when video is not found", async () => {
    const response = await request(app).get(`/videos/987}`);

    expect(response.status).toBe(404);
  });

  // Test for PUT endpoint
  it("should fail to update a video and return status 400", async () => {
    const updatedVideo = {
      availableResolutions: ["P144", "P240"],
      canBeDownloaded: false,
      minAgeRestriction: 21,
      publicationDate: new Date().toISOString(),
    };

    const response = await request(app)
      .put(`/videos/${videoId}`)
      .send(updatedVideo);

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      errorsMessages: [
        { message: "problem with the title field", field: "title" },
        { message: "problem with the author field", field: "author" },
        {
          message: "problem with the minAgeRestriction field",
          field: "minAgeRestriction",
        },
      ],
    });
  });

  // Test for PUT endpoint
  it("should update a video and return status 204", async () => {
    const updatedVideo = {
      title: "Updated Video",
      author: "Updated Author",
      availableResolutions: ["P144", "P240"],
      canBeDownloaded: false,
      minAgeRestriction: 16,
      publicationDate: new Date().toISOString(),
    };

    const responseFailed = await request(app)
      .put(`/videos/123`)
      .send(updatedVideo);

    expect(responseFailed.status).toBe(404);

    const response = await request(app)
      .put(`/videos/${videoId}`)
      .send(updatedVideo);

    expect(response.status).toBe(204);
  });

  // Test for GET endpoint to fetch a specific video by id
  it("should fetch a video by id and return status 200", async () => {
    const response = await request(app).get(`/videos/${videoId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: videoId,
      title: "Updated Video",
      author: "Updated Author",
      availableResolutions: ["P144", "P240"],
      canBeDownloaded: false,
      minAgeRestriction: 16,
      createdAt: expect.any(String),
      publicationDate: expect.any(String),
    });
  });

  // Test for DELETE endpoint
  it("should delete a video and return status 204", async () => {
    const response = await request(app).delete(`/videos/${videoId}`);

    expect(response.status).toBe(204);
  });

  // Test for DELETE endpoint when video is not found
  it("should return status 404 when video is not found", async () => {
    const response = await request(app).delete(`/videos/888`);

    expect(response.status).toBe(404);
  });

  // Test for GET endpoint to fetch all videos when no videos are available
  it("should fetch all videos and return status 200", async () => {
    const response = await request(app).get("/videos");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toMatchObject([]);
  });
});

import { Router } from "express";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { convertVideosDatesToISO, convertVideoDatesToISO } from "./utils";
import { videoRepository, Video } from "../repositories/videos-repo";

export const videosRouter = Router();

videosRouter.get("/", (req: Request, res: Response) => {
  return res
    .status(200)
    .send(convertVideosDatesToISO(videoRepository.findAll()));
});

videosRouter.post("/", (req: Request, res: Response) => {
  //get title, author and availableResolutions from the request body
  const { title, author, availableResolutions } = req.body;
  //check if title is provided and is not longer than 40 characters
  const errorsMessages = [];
  if (!title || title.length > 40) {
    errorsMessages.push({
      message: "problem with the title field",
      field: "title",
    });
  }
  //check if author is provided and is not longer than 20 characters
  if (!author || author.length > 20) {
    errorsMessages.push({
      message: "problem with the title field",
      field: "author",
    });
  }
  if (errorsMessages.length > 0) {
    return res.status(400).send(errorsMessages);
  }

  const newVideo: Video = {
    id: uuidv4(),
    title,
    author,
    availableResolutions,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date(),
    publicationDate: new Date(),
  };

  const isCreated = videoRepository.create(newVideo);
  if (isCreated) {
    const createdVideo = videoRepository.findById(newVideo.id);
    if (createdVideo)
      return res.status(201).send(convertVideoDatesToISO(createdVideo));
  }
  return res.sendStatus(500);
});

videosRouter.get("/:id", (req: Request, res: Response) => {
  //using the passed id find the video in the videos array
  const video = videoRepository.findById(req.params.id);
  //if the video is not found return a 404 status code
  if (!video) {
    return res.sendStatus(404);
  }
  //if the video is found return the video object
  return res.send(video);
});

videosRouter.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    author,
    availableResolutions,
    canBeDownloaded = false,
    minAgeRestriction,
    publicationDate,
  } = req.body;

  // Check if title is provided and is not longer than 40 characters
  const errorsMessages = [];
  if (!title || title.length > 40) {
    errorsMessages.push({
      message: "problem with the title field",
      field: "title",
    });
  }

  //check if author is provided and is not longer than 20 characters
  if (!author || author.length > 20) {
    errorsMessages.push({
      message: "problem with the author field",
      field: "author",
    });
  }

  //check if minAgeRestriction is between 1 and 18
  if (minAgeRestriction < 1 || minAgeRestriction > 18) {
    errorsMessages.push({
      message: "problem with the minAgeRestriction field",
      field: "minAgeRestriction",
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).send(errorsMessages);
  }

  const video = videoRepository.findById(id);

  if (!video) {
    return res.sendStatus(404);
  } else {
    const updatedVideo = {
      ...video,
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate: new Date(publicationDate),
    };
    if (videoRepository.updateById(id, updatedVideo)) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(500);
    }
  }
});

videosRouter.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (videoRepository.deleteById(id)) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(404);
  }
});

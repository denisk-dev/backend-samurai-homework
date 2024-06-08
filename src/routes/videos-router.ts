import { Router } from "express";
import { Request, Response } from "express";
// import { v4 as uuidv4 } from "uuid";

import {
  videoRepository,
  Video,
  Resolution,
} from "../repositories/videos-repo";

export const videosRouter = Router();

videosRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).send(videoRepository.findAll());
});

videosRouter.post("/", (req: Request, res: Response) => {
  //get title, author and availableResolutions from the request body
  const { title, author, availableResolutions, canBeDownloaded } = req.body;
  //check if title is provided and is not longer than 40 characters
  const errorsMessages = [];
  if (!title?.trim() || title.length > 40) {
    errorsMessages.push({
      message: "problem with the title field",
      field: "title",
    });
  }
  //check if author is provided and is not longer than 20 characters
  if (!author?.trim() || author.length > 20) {
    errorsMessages.push({
      message: "problem with the author field",
      field: "author",
    });
  }

  if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
    errorsMessages.push({
      message: "problem with the canBeDownloaded field",
      field: "canBeDownloaded",
    });
  }
  //make sure availableResolutions only contain valid resolutions (Resolution enums)
  if (
    !Array.isArray(availableResolutions) ||
    availableResolutions.some(
      (resolution) => !Object.values(Resolution).includes(resolution)
    )
  ) {
    errorsMessages.push({
      message: "problem with the availableResolutions field",
      field: "availableResolutions",
    });
  }
  if (errorsMessages.length > 0) {
    return res.status(400).send({ errorsMessages });
  }

  const today = new Date();
  const tomorrow = new Date(today.getTime());
  tomorrow.setDate(tomorrow.getDate() + 1);

  const newVideo: Video = {
    id: +new Date(),
    title,
    author,
    availableResolutions,
    canBeDownloaded: canBeDownloaded ? canBeDownloaded : false,
    minAgeRestriction: null,
    createdAt: today.toISOString(),
    publicationDate: tomorrow.toISOString(),
  };

  const isCreated = videoRepository.create(newVideo);
  if (isCreated) {
    const createdVideo = videoRepository.findById(newVideo.id);
    if (createdVideo) return res.status(201).send(createdVideo);
  }
  return res.sendStatus(500);
});

videosRouter.get("/:id", (req: Request, res: Response) => {
  //using the passed id find the video in the videos array
  const video = videoRepository.findById(Number(req.params.id));
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
  if (!title?.trim() || title.length > 40) {
    errorsMessages.push({
      message: "problem with the title field",
      field: "title",
    });
  }

  //check if author is provided and is not longer than 20 characters
  if (!author?.trim() || author.length > 20) {
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

  if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
    errorsMessages.push({
      message: "problem with the canBeDownloaded field",
      field: "canBeDownloaded",
    });
  }

  if (
    !Array.isArray(availableResolutions) ||
    availableResolutions.some(
      (resolution) => !Object.values(Resolution).includes(resolution)
    )
  ) {
    errorsMessages.push({
      message: "problem with the availableResolutions field",
      field: "availableResolutions",
    });
  }

  //check if publicationDate is in the ISO format
  const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  if (!isoFormat.test(publicationDate)) {
    errorsMessages.push({
      message: "problem with the publicationDate field",
      field: "publicationDate",
    });
  }

  if (errorsMessages.length > 0) {
    return res.status(400).send({ errorsMessages });
  }

  const video = videoRepository.findById(Number(id));

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
      publicationDate,
    };
    if (videoRepository.updateById(Number(id), updatedVideo)) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(500);
    }
  }
});

videosRouter.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (videoRepository.deleteById(Number(id))) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(404);
  }
});

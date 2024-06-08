import express, { Request, Response } from "express";
import { videosRouter } from "./routes/videos-router";
import { videoRepository } from "./repositories/videos-repo";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/videos", videosRouter);
app.use("/api/testing/all-data", (req: Request, res: Response) => {
  videoRepository.deleteAll();
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;

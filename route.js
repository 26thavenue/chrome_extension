import  express  from "express";
import {store} from './middleware.js'
const router = express.Router();

import {
  createVideo,
  uploadVideoBytes,
  streamVideo,
  autoStream,
} from "./controller.js"

router.get("/api/create", createVideo);
router.post("/api/upload/:id", store.single("file"), uploadVideoBytes);
router.get("/api/stream/:id", streamVideo);
router.get("/api/autostream/:id", autoStream);

export default router

import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../config/upload.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  upload.single("avatar"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "Please upload an avatar image.",
      });
    }

    res.status(201).json({
      url: `/uploads/${req.file.filename}`,
    });
  }
);

export default router;

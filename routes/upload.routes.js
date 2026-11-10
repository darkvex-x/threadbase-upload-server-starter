import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../config/upload.js";

const router = Router();

// POST /api/upload
// Applies verifyToken before upload.single("avatar")
router.post(
  "/upload",
  verifyToken,
  (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) {
        // Return 400 if file filter rejected non-image or file too large
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Missing avatar file" });
    }

    // Respond with 201 and URL to access the uploaded file
    const url = `/uploads/${req.file.filename}`;
    return res.status(201).json({ url });
  }
);

export default router;

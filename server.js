import "dotenv/config";
import express from "express";
import cors from "cors";
import threadsRouter from "./routes/threads.js";
import authRouter from "./routes/auth.js";
import prisma from "./prisma/client.js";
import verifyToken from "./middleware/verifyToken.js";
import uploadRouter from "./routes/upload.routes.js";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRouter);

app.use("/auth", authRouter);          // provided scaffold — issues tokens
app.use("/api/threads", threadsRouter);

// Protected route GET /api/me
app.get("/api/me", verifyToken, (req, res) => {
  res.json(req.user);
});

// Global error handler (4 arguments).
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.code === "LIMIT_FILE_SIZE"
        ? "File size must not exceed 5 MB."
        : err.message,
    });
  }

  if (
    err.message ===
    "Only JPEG, PNG, WebP and GIF images are allowed."
  ) {
    return res.status(400).json({
      error: err.message,
    });
  }

  res.status(500).json({
    error: {
      code: "INTERNAL",
      message: "Something went wrong",
    },
  });
});

const PORT = 3001;

async function start() {
  await prisma.$connect();
  console.log("✅ Prisma connected");
  app.listen(PORT, () => {
    console.log(`✅ Threadbase API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start");
  console.error(err);
  process.exit(1);
});

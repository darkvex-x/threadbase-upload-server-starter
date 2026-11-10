import "dotenv/config";
import express from "express";
import cors from "cors";
import threadsRouter from "./routes/threads.js";
import authRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.routes.js";
import prisma from "./prisma/client.js";
import verifyToken from "./middleware/verifyToken.js";

const app = express();
app.use(cors());
app.use(express.json());

// Task 3: Serve uploads statically so files are reachable by URL
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);          // provided scaffold — issues tokens
app.use("/api/threads", threadsRouter);
app.use("/api", uploadRouter);          // wires POST /api/upload

// Protected route GET /api/me
app.get("/api/me", verifyToken, (req, res) => {
  res.json(req.user);
});

// Global error handler (4 arguments).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL", message: "Something went wrong" } });
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

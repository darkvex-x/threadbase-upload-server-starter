import prisma from "./client.js";

// Three authors (ids 1, 2, 3) plus a set of threads.
// The demo login in routes/auth.js issues tokens for userId 1 and 2,
// which line up with the Ada and Linus authors created here.
async function main() {
  await prisma.comment.deleteMany();
  await prisma.thread.deleteMany();
  await prisma.author.deleteMany();

  // Explicit ids so they always line up with the demo users in routes/auth.js
  // (userId 1 = Ada, userId 2 = Linus). Without pinned ids, SQLite's
  // autoincrement would drift across re-seeds and break the token's authorId.
  const ada = await prisma.author.create({
    data: { id: 1, name: "Ada", avatarUrl: "/avatars/ada.svg" },
  });
  const linus = await prisma.author.create({
    data: { id: 2, name: "Linus", avatarUrl: "/avatars/linus.svg" },
  });
  const grace = await prisma.author.create({
    data: { id: 3, name: "Grace", avatarUrl: "/avatars/grace.svg" },
  });
  const authors = [ada.id, linus.id, grace.id];

  const TOTAL = 12;
  const hoursAgo = (n) => new Date(Date.now() - n * 3_600_000);

  for (let i = 1; i <= TOTAL; i++) {
    const authorId = i % 7 === 0 ? null : authors[i % authors.length];

    const thread = await prisma.thread.create({
      data: {
        title: `Thread #${String(i).padStart(2, "0")}`,
        body: `Seeded thread number ${i}.`,
        authorId,
        createdAt: hoursAgo(TOTAL - i),
      },
    });

    const commentCount = i % 4;
    if (commentCount > 0) {
      await prisma.comment.createMany({
        data: Array.from({ length: commentCount }, (_, c) => ({
          body: `Comment ${c + 1} on thread ${i}`,
          threadId: thread.id,
        })),
      });
    }
  }

  console.log(`✅ Seeded ${TOTAL} threads and 3 authors`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

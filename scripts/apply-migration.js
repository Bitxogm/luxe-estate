const { Client } = require("pg");
const { readFileSync } = require("fs");
const { resolve } = require("path");

const envFile = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
const dbUrl = envFile.match(/DATABASE_URL="([^"]+)"/)?.[1];
if (!dbUrl) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const sql = readFileSync(
  resolve(__dirname, "../prisma/migrations/20260511120000_add_visits/migration.sql"),
  "utf-8"
);

async function run() {
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    await client.query(sql);
    console.log("Migration applied successfully.");
  } finally {
    await client.end();
  }
}

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});

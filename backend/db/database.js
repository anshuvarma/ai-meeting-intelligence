const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../../meetings.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database error:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS meetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT,
      transcript TEXT,
      summary TEXT,
      action_items TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'processing'
    )
  `);
});


// 🔍 TEMP DEBUG — list meetings table schema
// ✅ Safe migrations for meetings table
db.all("PRAGMA table_info(meetings);", [], (err, columns) => {
  if (err) {
    console.error("Migration check failed:", err);
    return;
  }

  const columnNames = columns.map(col => col.name);

  // 🟢 Add status column if missing
  if (!columnNames.includes("status")) {
    console.log("🛠 Adding status column...");

    db.run(
      `ALTER TABLE meetings ADD COLUMN status TEXT DEFAULT 'processing'`,
      (err) => {
        if (err) console.error("❌ Failed to add status:", err);
        else console.log("✅ Status column added");
      }
    );
  }

  // 🟢 Add meeting_title column if missing
  if (!columnNames.includes("meeting_title")) {
    console.log("🛠 Adding meeting_title column...");

    db.run(
      `ALTER TABLE meetings ADD COLUMN meeting_title TEXT`,
      (err) => {
        if (err) console.error("❌ Failed to add meeting_title:", err);
        else console.log("✅ meeting_title column added");

      }

    );
  }

  console.table(columns);
});


module.exports = db;

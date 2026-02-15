const db = require("../db/database");
const { transcribeAudio } = require("../services/transcribeService");
const { generateMeetingInsights } = require("../services/summaryService");
const path = require("path");
const fs = require("fs");
const { meetingQueue } = require("../queue/meetingQueue");



exports.uploadMeeting = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "No file uploaded",
            });
        }


        // Insert into DB
        const meetingTitle = req.body.meeting_title || "Untitled Meeting";
        const filePath = req.file.path.replace(/\\/g, "/");

        db.run(
            `INSERT INTO meetings (meeting_title, file_path, status)
   VALUES (?, ?, 'processing')`,
            [meetingTitle, filePath],
            async function (err) {
                if (err) {
                    console.error("DB insert error:", err);
                    return res.status(500).json({ error: "DB error" });
                }

                const meetingId = this.lastID;

                try {
                    // 🚀 enqueue background job
                    await meetingQueue.add("process-meeting", {
                        meetingId,
                        filePath,
                    });

                    // ⚡ fast response
                    res.json({
                        message: "Meeting uploaded and processing started",
                        meetingId,
                        status: "processing",
                    });
                } catch (queueErr) {
                    console.error("Queue error:", queueErr);
                    res.status(500).json({ error: "Queue failed" });
                }
            }
        );


    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            error: "Upload failed",
        });
    }
};


// ===============================
// GET single meeting
// ===============================
exports.getMeetingById = (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT * FROM meetings WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) {
                console.error("DB fetch error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (!row) {
                return res.status(404).json({ error: "Meeting not found" });
            }

            res.json({
                ...row,
                action_items: row.action_items
                    ? JSON.parse(row.action_items)
                    : [],
            });
        }
    );
};

// ===============================
// GET all meetings
// ===============================
exports.getAllMeetings = (req, res) => {
    db.all(
        `SELECT * FROM meetings`,
        [],
        (err, rows) => {
            if (err) {
                console.error("DB fetch error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json(rows);
        }
    );
};

// ===============================
// DELETE meeting
// ===============================
exports.deleteMeeting = (req, res) => {

    const { id } = req.params;

    // Step 1: get file path first
    db.get(`SELECT file_path FROM meetings WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error("DB fetch error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (!row) {
            return res.status(404).json({ error: "Meeting not found" });
        }

        const filePath = row.file_path;

        // Step 2: delete DB record
        db.run(`DELETE FROM meetings WHERE id = ?`, [id], function (delErr) {
            if (delErr) {
                console.error("DB delete error:", delErr);
                return res.status(500).json({ error: "Delete failed" });
            }

            // Step 3: delete file from disk (safe)
            if (filePath) {
                const absolutePath = path.join(process.cwd(), filePath);

                fs.unlink(absolutePath, (fileErr) => {
                    if (fileErr) {
                        console.warn("File delete warning:", fileErr.message);
                    }
                });
            }

            res.json({
                message: "Meeting deleted successfully",
                deletedId: id,
            });
        });
    });
};


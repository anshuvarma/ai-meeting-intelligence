// AI ENGINE
// pulls job from Redis
// runs Whisper
// runs Ollama
// updates DB
// marks status


const { Worker } = require("bullmq");
const { connection } = require("../queue/meetingQueue");
const db = require("../db/database");
const { transcribeAudio } = require("../services/transcribeService");
const { generateMeetingInsights } = require("../services/summaryService");

console.log("🚀 Meeting worker started...");

const worker = new Worker(
    "meeting-processing",
    async (job) => {
        const { meetingId, filePath } = job.data;

        try {
            console.log(`🎯 Processing meeting ${meetingId}`);

            // STEP 1 — Transcription
            const transcript = await transcribeAudio(filePath);

            // STEP 2 — Summary
            const insights = await generateMeetingInsights(transcript);

            // STEP 3 — Update DB
            await new Promise((resolve, reject) => {
                db.run(
                    `UPDATE meetings
           SET transcript = ?, summary = ?, action_items = ?, status = 'completed'
           WHERE id = ?`,
                    [
                        transcript,
                        insights.summary,
                        JSON.stringify(insights.actionItems),
                        meetingId,
                    ],
                    (err) => (err ? reject(err) : resolve())
                );
            });

            console.log(`✅ Meeting ${meetingId} completed`);
        } catch (error) {
            console.error(`❌ Meeting ${meetingId} failed`, error);

            db.run(
                `UPDATE meetings SET status = 'failed' WHERE id = ?`,
                [meetingId]
            );
        }
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`🎉 Job ${job.id} done`);
});

worker.on("failed", (job, err) => {
    console.error(`💥 Job ${job.id} failed`, err);
});

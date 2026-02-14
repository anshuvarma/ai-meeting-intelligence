const express = require("express");
const multer = require("multer");
const path = require("path");
const meetingController = require("../controllers/meetingController");

const router = express.Router();

const fs = require("fs");

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

/*
Storage configuration
*/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// /Upload meeting route
router.post("/upload", upload.single("meetingAudio"), meetingController.uploadMeeting
);

// Get all meetings
router.get("/", meetingController.getAllMeetings);

// Get meeting by id
router.get("/:id", meetingController.getMeetingById);

// Delete meeting
router.delete("/:id", meetingController.deleteMeeting);

module.exports = router;

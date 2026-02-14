require("dotenv").config();
const express = require("express");
const cors = require("cors");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Meeting Intelligence API running 🚀");
});

app.use("/api/meetings", meetingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const { exec } = require("child_process");
const path = require("path");

exports.transcribeAudio = async (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            // absolute path to python script
            const scriptPath = path.join(
                process.cwd(),
                "python",
                "transcribe.py"
            );

            // build command
            const command = `python "${scriptPath}" "${filePath}"`;

            console.log("🎤 Running Whisper locally...");

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Whisper exec error:", stderr);
                    return reject(error);
                }

                const cleaned = stdout.replace(/\s+/g, " ").trim();
                resolve(cleaned);
            });
        } catch (err) {
            reject(err);
        }
    });
};

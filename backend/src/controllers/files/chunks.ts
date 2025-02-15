import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getVideoChunk = (req: Request, res: Response): void => {
    try {
        const { key } = req.query; //  Use "key" to receive file name
        if (!key || typeof key !== "string") {
            res.status(400).json({ message: "Missing or invalid file key" });
            return;
        }

        const decodedKey = decodeURIComponent(key); //  Decode URL-encoded names
        const videoPath = path.join(__dirname, "../../../image", decodedKey);

        if (!fs.existsSync(videoPath)) {
            res.status(404).json({ message: "File not found" });
            return;
        }

        const fileSize = fs.statSync(videoPath).size;
        const requestRangeHeader = req.headers.range;

        if (!requestRangeHeader) {
            res.writeHead(200, {
                "Content-Length": fileSize,
                "Content-Type": "video/mp4",
            });
            fs.createReadStream(videoPath).pipe(res);
        } else {
            const [start, end] = requestRangeHeader.replace(/bytes=/, "").split("-");
            const chunkStart = parseInt(start, 10);
            const chunkEnd = end ? parseInt(end, 10) : fileSize - 1;
            const chunkSize = chunkEnd - chunkStart + 1;

            const readStream = fs.createReadStream(videoPath, { start: chunkStart, end: chunkEnd });

            res.writeHead(206, {
                "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": chunkSize,
                "Content-Type": "video/mp4",
            });

            readStream.pipe(res);
        }
    } catch (error) {
        console.error("Error serving video:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
    }
};

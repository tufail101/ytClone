import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { uploadOnCloudinary } from "./cloudinay.js";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertVideo = async (videoPath) => {
  const resolutions = [
    { label: "144p", size: "256x144" },
    { label: "360p", size: "640x360" },
    { label: "720p", size: "1280x720" },
  ];

  const outPutUrl = {};
    const absoluteInputPath = path.resolve(videoPath);

  for (const { label, size } of resolutions) {
    const outputDir = path.resolve(__dirname, "../../public");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outPutPath = path.join(outputDir, `temp_${label}.mp4`);
    // const outPutPath = `../../public/temp/${label}.mp4`
    await new Promise((resolve, reject) => {
      ffmpeg(absoluteInputPath)
        .size(size)
        .output(outPutPath)
        .on("end", async () => {
          if (!fs.existsSync(outPutPath)) {
            return reject(`Output file not created for ${label}`);
          }

          try {
            const uploaded = await uploadOnCloudinary(outPutPath);

            if (uploaded.secure_url) {
              outPutUrl[label] = uploaded.secure_url;
              if (fs.existsSync(outPutPath)) {
                fs.unlinkSync(outPutPath);
              }
              resolve();
            } else {
              reject(`Cloud upload failed for ${label}`);
              // fs.unlinkSync(outPutPath);
            }
          } catch (err) {
            console.warn(`Cloudinary upload failed for ${label}`, err.message);
            if (fs.existsSync(outPutPath)) {
              fs.unlinkSync(outPutPath);
            }
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
            }
          }
        })
        .on("error", (err) => reject(err))
        .run();
    });
  }
  if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
  }
  return outPutUrl;
};

export { convertVideo };

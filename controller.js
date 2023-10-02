import fs from 'fs'
import path from 'path'
import createID from './helper.js'


export const createVideo = async (req, res) => {
  const video_id = createID(10);
  const videoFolderPath = path.join(
    process.cwd(),
    `.uploads/${video_id}`
  );
  fs.mkdir(videoFolderPath, { recursive: true }, (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ success: "folder created", video_id });
  });
};

export const uploadVideoBytes = async (req, res) => {
  const blobFile = req.file;
  const { id } = req.params;
  console.log(blobFile.buffer);
  const existingWriteFolder = `./public/uploads/${id}`;
  if (!fs.existsSync(existingWriteFolder)) {
    return res.status(500).json({ error: "invalid ID" });
  }
  const filename = id + ".blob";
  const completePath = path.join(existingWriteFolder, filename);
  const writeStream = fs.createWriteStream(completePath, { flags: "a" });

  // writeStream.write(blobFile.buffer);
  for (let offset = 0; offset < blobFile.buffer.length; offset += 1024) {
    const chunk = blobFile.buffer.slice(offset, offset + 1024); // Change 1024 to your desired chunk size
    writeStream.write(chunk);
  }

  writeStream.end();
  writeStream.on("finish", () => {
    return res.send({
      message: "file saved succesfully",
      link: `http://localhost:8000/api/vids/stream/${id}`,
    });
  });
  writeStream.on("error", () => {
    return res.send("error wrting file to disk");
  });
};
export const streamVideo = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const filePath = `./uploads/${id}/${id}.blob`;
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: "invalid ID" });
  }
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  console.log(fileSize);
  const fileStream = fs.createReadStream(filePath);
  const head = {
    "Content-Length": fileSize,
    "Content-Type": "video/mp4",
  };
  res.writeHead(200, head);
  fileStream.pipe(res);
};

export const autoStream = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const filePath = `./uploads/${id}/${id}.blob`;
  if (!fs.existsSync(filePath)) {
    return res.status(500).json({ error: "invalid ID" });
  }
  res.render("view", {
    videoLink: `http://localhost:8000/api/vids/stream/${id}`,
  });
};


import fs from "fs";

export function deleteFile(filePath) {
  if (!filePath) return;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("ERROR DELETING FILE:", err.message);
    }
  });
}

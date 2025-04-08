import * as dbToolsService from "../services/dbTools.service.js";

export const backupDatabase = async (req, res, next) => {
  try {
    const filePath = await dbToolsService.backup();
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

export const restoreDatabase = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;

    await dbToolsService.restore(filePath);
    res.send("Database restored successfully");
  } catch (error) {
    next(error);
  }
};

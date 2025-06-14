import Team from "../models/team.model.js";
import fs from "fs";
import path from "path";

// Get all team
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll();

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    const teamWithImageUrl = teams.map((team) => ({
      ...team,
      image: team.image ? `${hostUrl}/uploads/images/${team.image}` : null,
    }));

    res.status(200).json({ success: true, data: teamWithImageUrl });
  } catch (error) {
    next(error);
  }
};

// Get a single team by ID
export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

// Create a new team
export const createTeam = async (req, res, next) => {
  try {
    const { name, surname, position, facebook, instagram, twitter } = req.body;

    const image = req.file?.filename;

    const newTeam = await Team.create({
      name,
      surname,
      position,
      image,
      facebook,
      instagram,
      twitter,
    });

    res.status(201).json({ success: true, data: newTeam });
  } catch (error) {
    next(error);
  }
};

// Update a team
export const updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { name, surname, position, facebook, instagram, twitter } = req.body;

    const newImage = req.file?.filename;

    if (newImage && team.image) {
      const oldImagePath = path.join("uploads", "images", team.image);

      // Check if the old image exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }

    const image = newImage ?? team.image;

    const updatedTeam = await Team.update(id, {
      name,
      surname,
      position,
      image,
      facebook,
      instagram,
      twitter,
    });

    res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    next(error);
  }
};

// Delete a team
export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (team.image) {
      const imagePath = path.join("uploads", "images", team.image);

      // Check if the old image exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the old image
      }
    }

    const result = await Team.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

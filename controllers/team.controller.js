import Team from "../models/team.model.js";

// Get all team
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll();
    res.status(200).json({ success: true, data: teams });
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
    const { name, surname, position, image, facebook, instagram, twitter } =
      req.body;

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

    const { name, surname, position, image, facebook, instagram, twitter } =
      req.body;

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

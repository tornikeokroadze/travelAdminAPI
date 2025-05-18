import Event from "../models/event.model.js";

// Get all event
export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// Get a single event by ID
export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// Create a new event
export const createEvent = async (req, res, next) => {
  try {
    const { title, start_date, end_date, event_level } = req.body;

    const newEvent = await Event.create({
      title,
      start_date,
      end_date,
      event_level,
    });

    const io = req.app.get("io");
    io.emit("event:created", newEvent);

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    next(error);
  }
};

// Update a event
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { title, start_date, end_date, event_level } = req.body;

    const updatedEvent = await Event.update(id, {
      title,
      start_date,
      end_date,
      event_level,
    });

    const io = req.app.get("io");
    io.emit("event:updated", updatedEvent);

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    next(error);
  }
};

// Delete a event
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Event.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const io = req.app.get("io");
    io.emit("event:deleted", { id });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller.js";

const eventRouter = Router();

eventRouter.get('/', authorize, getEvents);

eventRouter.get('/:id', authorize, getEvent);

eventRouter.post('/', authorize, createEvent);

eventRouter.put('/:id', authorize, updateEvent);

eventRouter.delete('/:id', authorize, deleteEvent);

export default eventRouter;
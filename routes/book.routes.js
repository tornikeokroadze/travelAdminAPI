import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getBooks, getBook, updateBook } from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get('/', authorize, getBooks);

bookRouter.get('/:id', authorize, getBook);

bookRouter.put('/:id', authorize, updateBook);

export default bookRouter;
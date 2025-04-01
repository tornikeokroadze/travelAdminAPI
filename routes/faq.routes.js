import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getFaqs, getFaq, createFaq, updateFaq, deleteFaq, } from "../controllers/faq.controller.js";

const faqRouter = Router();

faqRouter.get('/', authorize, getFaqs);

faqRouter.get('/:id', authorize, getFaq);

faqRouter.post('/', authorize, createFaq);

faqRouter.put('/:id', authorize, updateFaq);

faqRouter.delete('/:id', authorize, deleteFaq);

export default faqRouter;
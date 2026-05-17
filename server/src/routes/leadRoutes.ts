import { Router } from "express";
import { createLead, deleteLead, getLead, listLeads, updateLead } from "../controllers/leadController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateCreateLead, validateLeadFilters, validateLeadId, validateUpdateLead } from "../middleware/validate.js";

export const leadRouter = Router();

leadRouter.use(authenticate);

leadRouter.get("/", validateLeadFilters, listLeads);
leadRouter.post("/", authorize("admin", "sales"), validateCreateLead, createLead);
leadRouter.get("/:id", validateLeadId, getLead);
leadRouter.patch("/:id", authorize("admin", "sales"), validateLeadId, validateUpdateLead, updateLead);
leadRouter.delete("/:id", authorize("admin"), validateLeadId, deleteLead);

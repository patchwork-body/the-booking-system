import { propertyService } from "@app/v1/services";
import { Router } from "express";

export const propertiesRouter = Router();

propertiesRouter.get("/properties", async (_req, res) => {
  res.status(200).json(await propertyService.list());
});

propertiesRouter.post("/properties", async (req, res) => {
  res.status(200).json(await propertyService.create(req.body));
});

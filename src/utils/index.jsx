import { z } from "zod";

const JeepCodeSchema = z.string().regex(/^\d{2}[A-Z]$/);

export function validateJeepCodes(input) {
  try {
    const parts = input.split(",");
    parts.forEach((part) => {
      JeepCodeSchema.parse(part.trim());
    });
    return true;
  } catch (error) {
    return false;
  }
}

import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean";
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  allowedValues?: string[];
};

export const validate = (rules: ValidationRule[]): RequestHandler => {
  return (req, res, next) => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      // Required check
      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`Le champ "${rule.field}" est obligatoire.`);
        continue;
      }

      // Skip optional empty fields
      if (value === undefined || value === null || value === "") continue;

      // Type check
      if (rule.type === "string" && typeof value !== "string") {
        errors.push(
          `Le champ "${rule.field}" doit être une chaîne de caractères.`,
        );
        continue;
      }

      if (rule.type === "number" && Number.isNaN(Number(value))) {
        errors.push(`Le champ "${rule.field}" doit être un nombre.`);
        continue;
      }

      // Boolean check
      if (rule.type === "boolean" && typeof value !== "boolean") {
        errors.push(`Le champ "${rule.field}" doit être un booléen.`);
        continue;
      }

      // String-specific checks
      if (typeof value === "string") {
        if (rule.minLength && value.trim().length < rule.minLength) {
          errors.push(
            `Le champ "${rule.field}" doit contenir au moins ${rule.minLength} caractères.`,
          );
        }

        if (rule.maxLength && value.trim().length > rule.maxLength) {
          errors.push(
            `Le champ "${rule.field}" ne doit pas dépasser ${rule.maxLength} caractères.`,
          );
        }

        if (rule.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(
            `Le champ "${rule.field}" doit être une adresse email valide.`,
          );
        }

        if (rule.allowedValues && !rule.allowedValues.includes(value)) {
          errors.push(
            `Le champ "${rule.field}" doit être l'une des valeurs : ${rule.allowedValues.join(", ")}.`,
          );
        }
      }
    }

    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors });
      return;
    }

    next();
  };
};

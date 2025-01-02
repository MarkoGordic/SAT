import { Request, Response, NextFunction } from "express";
import { hasPermission, Permissions } from "../utils/permissionManager";

/**
 * Middleware to check permissions
 * @param resource - The resource for which permission is being checked
 * @param action - The action being performed on the resource
 * @param data - Optional data passed directly as a parameter
 */
export function checkPermission<Resource extends keyof Permissions>(
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const isAllowed = hasPermission(user, resource, action, data);

    if (!isAllowed) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
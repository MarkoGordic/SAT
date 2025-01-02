import { User, JwtUser, Role } from "../types";

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: JwtUser, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

export type Permissions = {
  user: {
    dataType: User;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  admin: {
    user: {
      view: true,
      create: true,
      update: true,
      delete: (user, data) => user.id !== data.id,
    },
  },
  professor: {
    user: {
      view: (user, data) => user.id === data.id,
      update: (user, data) => user.id === data.id,
    },
  },
  assistant: {
    user: {
      view: (user, data) => user.id === data.id,
      update: (user, data) => user.id === data.id,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: JwtUser,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}

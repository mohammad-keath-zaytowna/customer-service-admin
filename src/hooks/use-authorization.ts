import { useUser, UserRole } from "@/contexts/UserContext";

const permissions = {
  orders: {
    canChangeStatus: ["super_admin", "admin", "cashier"],
    canPrint: ["super_admin", "admin", "cashier"],
    // 👇 جديد: حتى يشتغل زر Edit بدون ما يوقع includes
    canUpdate: ["super_admin", "admin"],
  },
  categories: {
    canCreate: ["super_admin", "admin"],
    canDelete: ["super_admin", "admin"],
    canEdit: ["super_admin", "admin"],
    canTogglePublished: ["super_admin", "admin"],
  },
  coupons: {
    canCreate: ["super_admin", "admin"],
    canDelete: ["super_admin", "admin"],
    canEdit: ["super_admin", "admin"],
    canTogglePublished: ["super_admin", "admin"],
  },
  customers: {
    canDelete: ["super_admin"],
    canEdit: ["super_admin", "admin"],
  },
  products: {
    canCreate: ["super_admin", "admin"],
    canDelete: ["super_admin", "admin"],
    canEdit: ["super_admin", "admin"],
    canTogglePublished: ["super_admin", "admin"],
  },
  staff: {
    canDelete: ["super_admin"],
    canEdit: ["super_admin"],
    canTogglePublished: ["super_admin"],
  },
} as const;

type PermissionMap = typeof permissions;
type Feature = keyof PermissionMap;

export function useAuthorization() {
  const { user, profile, isLoading } = useUser();

  const hasPermission = <F extends Feature>(
    feature: F,
    action: keyof PermissionMap[F]
  ): boolean => {
    // لسا عم يحمّل أو ما في رول؟
    const role = profile?.role;
    if (isLoading || !role) return false;

    // feature موجود؟
    const featureMap = permissions[feature];
    if (!featureMap) return false;

    // action موجود؟
    const allowedRoles = featureMap[action];
    if (!Array.isArray(allowedRoles)) return false;

    // تحقق نهائي
    return (allowedRoles as readonly UserRole[]).includes(role);
  };

  const isSelf = (staffId: string) => {
    return user?.id === staffId;
  };

  return { hasPermission, isSelf, isLoading };
}

export type HasPermission = ReturnType<
  typeof useAuthorization
>["hasPermission"];
export type IsSelf = ReturnType<typeof useAuthorization>["isSelf"];

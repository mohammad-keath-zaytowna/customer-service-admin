import { SBProduct } from "@/services/products/types";
import { SBCategory } from "@/services/categories/types";
import { SBCoupon } from "@/services/coupons/types";
import { SBCustomer } from "@/services/customers/types";

type ValidationErrorsResponse = {
  validationErrors: Record<string, string>;
};

type DbErrorResponse = {
  dbError: string;
};

type SuccessResponse = {
  success: boolean;
};

export type ServerActionResponse = DbErrorResponse | SuccessResponse;

export type ProductServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      product: SBProduct;
    });

export type CategoryServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      category: SBCategory;
    });

export type CouponServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      coupon: SBCoupon;
    });

export type CustomerServerActionResponse =
  | ValidationErrorsResponse
  | DbErrorResponse
  | (SuccessResponse & {
      customer: SBCustomer;
    });

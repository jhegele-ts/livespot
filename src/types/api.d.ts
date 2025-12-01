declare type ApiSuccessResponse<T = unknown> = {
  success: true;
  data: T;
};

declare type ApiErrorResponse = {
  success: false;
  errorMessage: string;
};

declare type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;

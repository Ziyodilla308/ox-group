export const ERROR_MESSAGES = {
    INVALID_OTP: 'Invalid OTP provided',
    COMPANY_EXISTS: 'Company already exists',
    COMPANY_NOT_FOUND: 'Company not found',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_SIZE: 'Size must be 20 or less',
    INVALID_TOKEN: 'Invalid OX token',
    USER_NOT_FOUND: 'User not found',
    ONLY_MANAGERS_ACCESS_PRODUCTS: 'Only managers can access products',
    USER_NOT_ASSIGNED_TO_COMPANY: 'User is not assigned to any company',
} as const;

export const ROLES_KEY = 'roles';
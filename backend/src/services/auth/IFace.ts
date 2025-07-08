import { User } from '../../models'

export interface AuthUserSettings {
    key: string,
    value: string | number | null
}

export interface AuthUser {
    user: User;
    scope: string[];
    token: string;
    refresh: string;
}

export interface AuthUserJWT {
    company_id: number,
    employee_id: number,
    // scope: string[];
    // setting: AuthUserSettings[];
    tokenType: string;
}

export interface AuthUserJWTVerify {
    isValid: boolean,
    credentials?: {
        company_id: number,
        employee_id: number,
        tokenType: string
        // scope: string[],
        // setting: AuthUserSettings[]
    }
}

export interface ResetToken {
    name: string,
    email: string
}

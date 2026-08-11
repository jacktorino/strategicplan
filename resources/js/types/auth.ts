export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    // Spatie Roles & Permissions additions
    roles?: string[];
    permissions?: string[];
    is_executive?: boolean;
    role_label?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Auth {
    user: User | null;
}

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

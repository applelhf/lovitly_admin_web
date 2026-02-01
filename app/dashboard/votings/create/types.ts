export interface ProductItem {
    id: string;
    name: string;
    description: string;
    image: string; // File object url or blob url
}

export interface ParameterRow {
    id: string;
    name: string;
    values: Record<string, string>;
}

export interface UserOption {
    value: string; // userId
    label: string; // username
    avatar?: string;
    email: string;
    accountType: string;
}

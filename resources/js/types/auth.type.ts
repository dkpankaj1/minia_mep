import { PageProp } from "./global";

export type TAuthType = PageProp & {
    auth: {
        user: {
            roles: Array<string>;
            permissions: Array<string>;
            user: {
                id: number;
                name: string;
                email: string;
                avatar: string;
            };
        }
    }
}
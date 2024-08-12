/// <reference types="vite/client" />
import { route as ziggyRoute } from '../../../vendor/tightenco/ziggy'

export interface ImportMeta {
    glob: (pattern: string, options?: { eager?: boolean }) => Record<string, any>;
}
declare global {
    var route: typeof ziggyRoute;
}

export interface PageProp {
    [key: string]: unknown
}

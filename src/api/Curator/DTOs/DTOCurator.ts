import { EntityCurator } from "../entities/curator";

export type PublicCuratorAuthenticated = Omit<
    EntityCurator,
    | 'password'
>
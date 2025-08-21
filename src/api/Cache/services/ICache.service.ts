export interface ICacheServiceContract {
    set(key: string, value: string, expirationInSeconds: number): Promise<void>
    get(key: string): Promise<string | null>
    delete(key: string): Promise<void>
}
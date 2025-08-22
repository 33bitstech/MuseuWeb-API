import { createClient } from 'redis';
import { ICacheServiceContract } from '../ICache.service';

export class CacheService implements ICacheServiceContract {
    private isConnected = false;

    constructor(
        private client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        })
    ) {

        this.client.on('error', (err) => console.error('Redis Client Error', err));
    }

    private async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
        }
    }

    async set(key: string, value: string, expirationInSeconds: number): Promise<void> {
        await this.connect();
        await this.client.set(key, value, {
            EX: expirationInSeconds,
        });
    }

    async get(key: string): Promise<string | null> {
        await this.connect();
        return this.client.get(key);
    }

    async delete(key: string): Promise<void> {
        await this.connect();
        await this.client.del(key);
    }
        
}
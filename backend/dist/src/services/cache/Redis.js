"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const { REDIS_URL } = process.env;
const redisUrl = REDIS_URL;
const keyPrefix = 'saga';
const connectionPool = {};
class RedisCacheManager {
    constructor(namespace) {
        const key = `${keyPrefix}:${namespace}:`;
        if (connectionPool[key]) {
            this.redis = connectionPool[key];
        }
        else {
            //@ts-ignore
            this.redis = new ioredis_1.default(redisUrl, { keyPrefix: key });
            connectionPool[key] = this.redis;
        }
    }
    static create(namespace) {
        return new this(namespace);
    }
    static async close() {
        for (const key of Object.keys(connectionPool)) {
            await connectionPool[key].quit();
        }
    }
    async set(key, value, expiresInSeconds) {
        if (expiresInSeconds) {
            return this.redis.set(key.toString(), value, 'EX', expiresInSeconds);
        }
        return this.redis.set(key.toString(), value);
    }
    get(key) {
        return this.redis.get(key.toString());
    }
    del(key) {
        return this.redis.del(key.toString());
    }
    incr(key) {
        return this.redis.incr(key.toString());
    }
    decr(key) {
        return this.redis.decr(key.toString());
    }
}
exports.default = RedisCacheManager;

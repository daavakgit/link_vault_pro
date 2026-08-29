import mongoose from 'mongoose';

interface GlobalMongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServer?: any;
}

declare global {
  var mongooseCache: GlobalMongooseCache | undefined;
}

let cached: GlobalMongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let mongoUri = process.env.MONGODB_URI;

    cached.promise = (async () => {
      if (mongoUri) {
        try {
          // Try connecting to provided URI with 3 second timeout
          const instance = await mongoose.connect(mongoUri, {
            ...opts,
            serverSelectionTimeoutMS: 3000,
          });
          console.log('[MongoDB] Successfully connected to configured MONGODB_URI');
          return instance;
        } catch (err) {
          console.warn('[MongoDB] Could not connect to MONGODB_URI, spinning up in-memory MongoDB fallback...');
        }
      }

      // Fallback: Use MongoMemoryServer for real in-memory MongoDB database
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!cached.memoryServer) {
          cached.memoryServer = await MongoMemoryServer.create();
        }
        const memoryUri = cached.memoryServer.getUri();
        console.log('[MongoDB] Connected to in-memory MongoDB at:', memoryUri);
        return await mongoose.connect(memoryUri, opts);
      } catch (memErr) {
        console.error('[MongoDB] Failed to start in-memory MongoDB:', memErr);
        throw memErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

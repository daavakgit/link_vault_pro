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
          console.log('[MongoDB] Attempting connection to MONGODB_URI...');
          const instance = await mongoose.connect(mongoUri, {
            ...opts,
            serverSelectionTimeoutMS: 5000,
          });
          console.log('[MongoDB] ✅ Successfully connected to MongoDB Atlas!');
          return instance;
        } catch (err: any) {
          console.warn(
            '[MongoDB Warning] Could not connect to configured MONGODB_URI:',
            err.message
          );
          console.warn(
            '[MongoDB Tip] If using MongoDB Atlas, ensure your IP address is allowed in Atlas Network Access (0.0.0.0/0).'
          );
          console.warn('[MongoDB] Falling back to local in-memory database...');
        }
      }

      // Fallback: Use MongoMemoryServer for real in-memory MongoDB database
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!cached.memoryServer) {
          cached.memoryServer = await MongoMemoryServer.create();
        }
        const memoryUri = cached.memoryServer.getUri();
        console.log('[MongoDB] Connected to fallback in-memory database at:', memoryUri);
        return await mongoose.connect(memoryUri, opts);
      } catch (memErr) {
        console.error('[MongoDB Error] Failed to start in-memory MongoDB:', memErr);
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

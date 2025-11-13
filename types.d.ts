import { Connection } from "mongoose";

declare global {
    var mongoose: {
        conn: Connection | null;
        promise: Promise<Connection> | null;
    }
}

export {};

// what is the purpose of this file?
// This file is used to declare global types and variables for TypeScript.
// It ensures that the mongoose connection is properly typed and accessible globally
// throughout the application, preventing multiple connections during development with hot-reloading.
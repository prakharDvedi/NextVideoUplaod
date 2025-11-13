import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// the reason for ! at the end is to tell typescript that we are sure that this variable will be defined

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

//what is promise?
// A Promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It allows you to write asynchronous code in a more manageable way, avoiding deeply nested callbacks (callback hell).

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
// waht is this cached and global.mongoose?
// 'cached' is a local variable that holds the global mongoose connection state. 'global.mongoose' is a global variable that stores the connection and promise to ensure that the application reuses the same database connection across multiple requests, especially in development environments with hot-reloading.

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    mongoose.connect(MONGODB_URI).then(() => mongoose.connection);
    //what is mongoose.Connection?
    // mongoose.Connection is a class in the Mongoose library that represents a connection to a MongoDB database. It provides methods and properties to interact with the database, such as querying, updating, and managing collections.

    //what is then()?
    // then() is a method used with Promises in JavaScript. It allows you to specify what should happen when the Promise is resolved (successful) or rejected (failed). You can chain multiple then() calls to handle asynchronous operations in a sequential manner.
    //syntax of then()
    // promise.then(onFulfilled, onRejected);
  }

  try {
    cached.conn = await cached.promise;
    //what is await?
    // await is a keyword in JavaScript used inside async functions to pause the execution of the function until a Promise is resolved. It allows you to write asynchronous code in a more synchronous-looking manner, making it easier to read and maintain.
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

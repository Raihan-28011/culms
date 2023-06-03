const server = require("./server");
const database = require("./oradb");

async function startup() {
  console.log("Starting application");
  try {
    console.log("Initializing database");
    await database.initialize();
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }

  try {
    console.log("Initializing server");
    await server.initialize();
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
}

startup();

async function shutdown(e) {
  let err = e;
  console.log("Shutting down application");

  try {
    console.log("Closing database");
    await database.close();
  } catch (er) {
    console.error(er);
    err = err || er;
  }

  try {
    console.log("Closing server");
    await server.close();
  } catch (er) {
    console.error(er);
    err = err || er;
  }

  console.log("Exiting proccess");

  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

process.once("SIGTERM", async () => {
  console.log("Received SIGTERM");
  await shutdown();
});

process.once("SIGINT", async () => {
  console.log("Received SIGINT");
  await shutdown();
});

process.once("uncaughtException", async (err) => {
  console.log("Uncaught exception");
  console.error(err);
  await shutdown(err);
});

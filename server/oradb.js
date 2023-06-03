const oracledb = require("oracledb");
const { poolAttributes } = require("./dbconfig.js");

async function initialize() {
  const pool = await oracledb.createPool(poolAttributes.culms);
}

async function close() {
  await oracledb.getPool().close();
}

async function execute(stmt, binds = [], options = {}) {
  options.autoCommit = true;
  options.outFormat = oracledb.OUT_FORMAT_OBJECT;

  let result, connection;
  try {
    connection = await oracledb.getConnection();
    result = await connection.execute(stmt, binds, options);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }

    if (result) {
      return result;
    }

    return null;
  }
}

module.exports = {
  initialize,
  close,
  execute,
};

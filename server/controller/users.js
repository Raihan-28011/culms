const database = require("../oradb");

const getUserInfo = async (req, res) => {
  const { u_id } = req.query;
  let stmt =
    'select u_id as "u_id", \
            name as "name",  \
            email as "email", \
            password as "password", \
            TO_CHAR(join_date, \'DL\') as "join_date" \
            from users \
            where u_id = :u_id';
  const binds = { u_id };
  try {
    const result = await database.execute(stmt, binds);
    if (result.rows.length === 0) {
      res.status(401).json("Invalid user id");
      return;
    }

    res.status(200).json({
      u_id: result.rows[0].u_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      join_date: result.rows[0].join_date,
    });
  } catch (err) {
    console.error("User:userinfo: " + err);
    res.status(401).status("Could not get user info");
  }
};

module.exports = {
  getUserInfo,
};

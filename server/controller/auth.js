const database = require("../oradb");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  let stmt =
    "select * \
              from users \
              where email = :email";
  let binds = { email };

  try {
    const result = await database.execute(stmt, binds);
    if (result.rows.length != 0) {
      res.status(200).json("Email already registered");
      return;
    }

    const hash = bcrypt.hashSync(password, 10);
    stmt =
      "insert into users(name, email, password) values (:name, :email, :password)";
    binds = { name, email, password: hash };
    try {
      await database.execute(stmt, binds);
    } catch (err) {
      console.error("Auth:signup: " + err);
      res.status(401).json("Could not signup");
      return;
    }

    res.status(200).json("Signup successful");
  } catch (err) {
    console.error("Auth:signup: " + err);
    res.status(401).json("Could not signup");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let stmt =
    'select u_id as "u_id", \
            name as "name",  \
            email as "email", \
            password as "password", \
            TO_CHAR(join_date, \'DL\') as "join_date" \
            from users \
            where email = :email';
  let binds = { email };
  try {
    let result = await database.execute(stmt, binds);
    if (result.rows.length === 0) {
      res.status(200).json("Email not registered");
      return;
    }

    if (!bcrypt.compareSync(password, result.rows[0].password)) {
      res.status(200).json("Wrong password");
      return;
    }

    res.status(200).json({
      u_id: result.rows[0].u_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      join_date: result.rows[0].join_date,
    });
  } catch (err) {
    console.log("Auth:login: " + err);
    res.status(200).json("Could not log in");
  }
};

module.exports = {
  signup,
  login,
};

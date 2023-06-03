const poolAttributes = {
  culms: {
    user: process.env.CULMS_USER || "c##culms",
    password: process.env.CULMS_PASSSWORD || "culms",
    connectString: process.env.CULMS_DB || "orcl",
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
  },
};

module.exports = {
  poolAttributes,
};

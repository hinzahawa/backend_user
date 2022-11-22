const env = process.env.NODE_ENV || "dev";
const configApp = {
  dev: {
    DB_HOST: "localhost",
    MYSQL: "mysql",
    DATABASE: "training_user_fwd",
    DB_USERNAME: "root",
    DB_PASSWORD: "",
    SECRET_KEY: "XZecb6fNAkkJnrU2thH5",
  },
};

module.exports = configApp[env];

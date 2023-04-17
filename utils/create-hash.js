const bcrypt = require("bcrypt");

const hash_password = async (password, saltRounds) => {
  const abc = "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-:*;";
  let rs = "";
  while (rs.length < 16) {
    rs += abc[Math.floor(Math.random() * abc.length)];
  }
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.
    });
  });
  const rs_hash = await bcrypt.hash(rs_hash, 10);
};
hash_password();

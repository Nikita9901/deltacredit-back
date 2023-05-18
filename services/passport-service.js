nodemailer = require("nodemailer");
const db = require("../database/db");
const ApiError = require("../exceptions/api-error");

class PassportService {
  async updatePassportDetails(
    name,
    surname,
    country,
    city,
    address,
    passportSerialNumber,
    passportIdNumber,
    passportIssuedBy,
    idToken
  ) {
    const user = await db.query(
      `select *
             from users
             where id = ?`,
      [idToken]
    );
    if (!user[0][0]) throw ApiError.BadRequest("Нет такого пользователя.");
    await db.query(
      `update passport_details
       set name=?,
           surname=?,
           country=?,
           city=?,
           address=?,
           passport_serial_number=?,
           passport_id_number=?,
           passport_issued_by=?
       where user_id = ?`,
      [name, surname, country, city, address,passportSerialNumber, passportIdNumber, passportIssuedBy, idToken ]
    );
      const usersPassport = await db.query(
          `select *
             from passport_details
             where user_id = ?`,
          [idToken]
      );
    return usersPassport[0][0];
  }
}

module.exports = new PassportService();

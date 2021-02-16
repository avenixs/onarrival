const { sgMail } = require("../../app");
const { SYSTEM_EMAIL, SYSTEM_NAME } = require("../defaults/constants")
const { VERIFY_EMAIL_MESSAGE, USER_ACCOUNT_READY } = require("./email-messages")
const { VERIFY_EMAIL_TITLE, ACCOUNT_READY } = require("./email-titles")

exports.sendEmailVerification = (user, code) => {
    const text = VERIFY_EMAIL_MESSAGE(user, code);

    const message = {
        to: user.email,
        from: { 
            "email": SYSTEM_EMAIL,
            "name": SYSTEM_NAME
        },
        subject: VERIFY_EMAIL_TITLE,
        html: text
    }

    if(process.env.NODE_ENV !== "production") {
        return console.log(message);
    } else {
        return sgMail
            .send(message)
            .then(() => console.log("Verification email sent"))
            .catch(error => console.log(error))
    }
}

exports.sendNewRepresentativeEmail = (user, password) => {
    const text = USER_ACCOUNT_READY(user, password);

    const message = {
        to: user.email,
        from: { 
            "email": SYSTEM_EMAIL,
            "name": SYSTEM_NAME
        },
        subject: ACCOUNT_READY,
        html: text
    }

    if(process.env.NODE_ENV !== "production") {
        return console.log(message);
    } else {
        return sgMail
            .send(message)
            .then(() => console.log("Account ready email sent"))
            .catch(error => console.log(error))
    }
}
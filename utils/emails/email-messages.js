const { WEBSITE_URL, LOGO_URL } = require("../defaults/constants");

exports.VERIFY_EMAIL_MESSAGE = (user, code) => {
    return `Dear ${user.name}, <br /><br />Your account has been created successfully! Please press on the link below or copy it to your browser to confirm your email address and start using the app. <br /><br /><a href='${WEBSITE_URL}/verify/${code}' target='_blank'>${WEBSITE_URL}/verify/${code}</a><br /><br />Have a lovely day, OnArrivalUK<br /><img src='${LOGO_URL}' alt='OnArrival Logo'>`
}

exports.USER_ACCOUNT_READY = (user, password) => {
    return `Dear ${user.name}, <br /><br />This is to inform you that your employer has set up an OnArrivalUK account for you. Use the following credentials to log in and stay tuned for news from your employer. <br /><br /><b>Email</b>: ${user.email}<br /><b>Password</b>: ${password}<br /><br />Have a lovely day, <br />OnArrivalUK<br /><img src='${LOGO_URL}' alt='OnArrival Logo'>`
}
const verifyNumber = (length) => {
    const otp = Math.random()
        .toString()
        .slice(2, parseInt(length + 2));
    return otp;
};

module.exports = { verifyNumber };

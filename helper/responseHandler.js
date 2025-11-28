exports.responseHandler = (res, status, success, message, result) => {
    res.status(status).json({
        success,
        message,
        result: result
    });
};

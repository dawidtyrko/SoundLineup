function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        // Optionally, include stack trace in development mode
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

module.exports = errorHandler;
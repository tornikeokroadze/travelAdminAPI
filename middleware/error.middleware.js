const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    // Handle PostgreSQL Unique Violation (Duplicate entry error)
    if (err.code === "23505") {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Handle PostgreSQL Foreign Key Violation
    if (err.code === "23503") {
      const message = "Foreign key constraint failed";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Handle PostgreSQL Check Violation (e.g., validation failure like CHECK constraint)
    if (err.code === "23514") {
      const message = "Check constraint violation";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Handle PostgreSQL Not Null Violation
    if (err.code === "23502") {
      const message = "Field cannot be null";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Handle other validation errors or custom validation errors
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    // Generic error fallback
    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;

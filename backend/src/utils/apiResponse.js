export class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
  }

  static success(res, message = 'Operation successful', data = null, statusCode = 200) {
    const payload = {
      success: true,
      message,
    };
    if (data !== null) {
      payload.data = data;
    }
    return res.status(statusCode).json(payload);
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const payload = {
      success: false,
      message,
    };
    if (errors) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }
}

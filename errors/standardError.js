module.exports = class StandardError extends Error {
  constructor(message, cause, status) {
    super(message, { cause });
    this.status = status || 500;
  }
};

export default class InvalidUserNameError extends Error {
  constructor(username: string) {
    super(`The username ${username} is invalid.`);
    this.name = "InvalidUserNameError";
  }
}

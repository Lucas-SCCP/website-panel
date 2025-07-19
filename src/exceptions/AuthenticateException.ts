export class AuthenticateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticateException';
  }
}
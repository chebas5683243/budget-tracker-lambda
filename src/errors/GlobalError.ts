export class GlobalError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
    public detail?: string,
  ) {
    super(message);
  }

  getApiData() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
      }),
    };
  }
}

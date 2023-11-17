export class JsonResponse<T> {
  public success: boolean;
  public result: T;
  public results: T[];
  public message: string;

  /**
   *
   * @param success - The request is success or failed
   * The status of the request is success or failed
   * @defaultValue `false`
   */
  constructor(success = false) {
    this.success = success;
  }

  putErrorResponseModel(message: string) {
    this.success = false;
    this.message = message;
    this.result = null;
  }

  putErrorResponseArray(message: string) {
    this.success = false;
    this.message = message;
    this.results = [];
  }
}

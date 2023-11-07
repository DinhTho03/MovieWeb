export class JsonResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public result?: T,
  ) {}
}

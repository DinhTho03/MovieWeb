export declare class JsonResponse<T> {
    success: boolean;
    result: T;
    results: T[];
    message: string;
    constructor(success?: boolean);
    putErrorResponseModel(message: string): void;
    putErrorResponseArray(message: string): void;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResponse = void 0;
class JsonResponse {
    constructor(success = false) {
        this.success = success;
    }
    putErrorResponseModel(message) {
        this.success = false;
        this.message = message;
        this.result = null;
    }
    putErrorResponseArray(message) {
        this.success = false;
        this.message = message;
        this.results = [];
    }
}
exports.JsonResponse = JsonResponse;
//# sourceMappingURL=json-response.model.js.map
enum STATUS_CODE {
  SUCCESS = '200',
  BAD_REQUEST = '403',
}

class ServerResponse {
  private statusCode: STATUS_CODE;
  private payload: object;
  constructor(statusCode: STATUS_CODE, body: object) {
    this.statusCode = statusCode;
    this.payload = body;
  }
}

export class RequestFailed extends ServerResponse {
  constructor(body: object) {
    super(STATUS_CODE.BAD_REQUEST, body);
  }
}

export class RequestSuccess extends ServerResponse {
  constructor(body: object) {
    super(STATUS_CODE.SUCCESS, body);
  }
}

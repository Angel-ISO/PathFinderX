export class Result {
  constructor(isSuccess, value, error) {
    this.isSuccess = isSuccess;
    this.value = value;
    this.error = error;
    Object.freeze(this);
  }

  static ok(value) {
    return new Result(true, value, null);
  }

  static fail(error) {
    return new Result(false, null, error);
  }

  isOk() {
    return this.isSuccess;
  }

  isFail() {
    return !this.isSuccess;
  }

  map(fn) {
    return this.isOk() 
      ? Result.ok(fn(this.value)) 
      : Result.fail(this.error);
  }

  flatMap(fn) {
    return this.isOk() 
      ? fn(this.value) 
      : Result.fail(this.error);
  }

  fold(onSuccess, onFailure) {
    return this.isOk() 
      ? onSuccess(this.value) 
      : onFailure(this.error);
  }

  getOrElse(defaultValue) {
    return this.isOk() ? this.value : defaultValue;
  }
}
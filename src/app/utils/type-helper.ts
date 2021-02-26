export class TypeHelper {
  static isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
    return input !== null && input !== undefined;
  }
}

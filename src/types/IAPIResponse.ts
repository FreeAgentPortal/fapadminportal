export default interface IAPIResponse<T> {
  payload: T;
  metadata?: {
    [key: string]: any;
  };
}

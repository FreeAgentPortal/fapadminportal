export interface AlertMessage {
  // id is requried, but set by the store
  id?: string; // UUID for unique identification
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number; // in milliseconds
}

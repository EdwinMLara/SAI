export interface StandardResponse<T = any> {
   status: number;
   success: boolean;
   message: string;
   data: T | null;
}

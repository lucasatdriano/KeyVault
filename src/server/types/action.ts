export interface ActionResult<T = undefined> {
    success: boolean;
    message?: string;
    error?: string;
    fieldErrors?: Record<string, string>;
    data: T;
}

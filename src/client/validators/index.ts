export type ValidationErrors<T> = {
    [K in keyof T]?: string;
};

export function hasValidationErrors(
    errors: Record<string, string | undefined>,
): boolean {
    return Object.values(errors).some((error) => error?.trim() !== '');
}

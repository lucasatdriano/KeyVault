export const pluralize = (
    count: number,
    singular: string,
    plural: string,
): string => {
    return count === 1 ? singular : plural;
};

export const pluralizeWithCount = (
    count: number,
    singular: string,
    plural: string,
    zeroText?: string,
): string => {
    if (count === 0 && zeroText) {
        return zeroText;
    }
    return `${count} ${pluralize(count, singular, plural)}`;
};

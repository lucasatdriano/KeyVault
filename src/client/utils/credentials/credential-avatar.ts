export const getInitials = (title: string) => {
    return title
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

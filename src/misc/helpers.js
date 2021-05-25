export const getInitials = name => {
    const splitNames = name.toUpperCase().split(' ');
    if(splitNames.length > 1){
        return splitNames[0][0] + splitNames[1][0]
    }
    return splitNames[0][0]
};

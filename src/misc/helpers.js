export const getInitials = name => {
    const splitNames = name.toUpperCase().split(' ');
    if(splitNames.length > 1){
        return splitNames[0][0] + splitNames[1][0]
    }
    return splitNames[0][0]
};

export const transformToArrayWithId = (snapVal)=>  snapVal ? 
    Object.keys(snapVal).map(roomId=>({...snapVal[roomId], id: roomId}))
    : []


export const getBlob = canvas =>
new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
        if (blob) {
            resolve(blob);
        } else {
            reject(new Error('File process error.'));
        }
    });
});

export const fileInputTypes = '.jpg jpeg .png';
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
export const isValidFile = file => acceptedFileTypes.includes(file.type);

export const formatDate = (timeStamp)=>{
    const date = new Date(timeStamp)   
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    const  dateStr =
    `${(`00${  date.getDate()}`).slice(-2)  }/
    ${(`00${  date.getMonth() + 1}`).slice(-2)}/
    ${ date.getFullYear()  }
    at
    ${time} `

    return dateStr
}
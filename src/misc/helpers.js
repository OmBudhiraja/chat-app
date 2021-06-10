export const getInitials = name => {
    const splitNames = name.toUpperCase().split(' ');
    if (splitNames.length > 1) {
        return splitNames[0][0] + splitNames[1][0];
    }
    return splitNames[0][0];
};

export const transformToArray = (snapVal)=> snapVal ? Object.keys(snapVal) : []


export const transformToArrayWithId = snapVal =>
    snapVal
        ? Object.keys(snapVal).map(roomId => ({
              ...snapVal[roomId],
              id: roomId,
          }))
        : [];

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

export const formatDate = timeStamp => {
    const date = new Date(timeStamp);
    const time = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    const dateStr = `${`00${date.getDate()}`.slice(-2)}/
    ${`00${date.getMonth() + 1}`.slice(-2)}/
    ${date.getFullYear()}
    at
    ${time} `;

    return dateStr;
};

export const getUserUpdates = async (userId, keyToUpdate, value, db) => {
    const updates = {};

    updates[`/profiles/${userId}/${keyToUpdate}`] = value;

    const getMsgs = db
        .ref('/messages')
        .orderByChild('/author/uid')
        .equalTo(userId)
        .once('value');

    const getRooms = db
        .ref('/rooms')
        .orderByChild('/lastMessage/author/uid')
        .equalTo(userId)
        .once('value');

    const [MsgSnap, RoomSnap] = await Promise.all([getMsgs, getRooms]);

    MsgSnap.forEach(snap => {
        updates[`/messages/${snap.key}/author/${keyToUpdate}`] = value
    })

    RoomSnap.forEach(snap => {
        updates[`/rooms/${snap.key}/lastMessage/author/${keyToUpdate}`] = value
    })

    return updates

};


export const groupBy = (array, groupingKeyFn)=> array.reduce((result, item)=>{
    const groupingKey = groupingKeyFn(item)
    if(!result[groupingKey]){
        result[groupingKey] = []
    }
    
    result[groupingKey].push(item) 

    return result

}, {})

export const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

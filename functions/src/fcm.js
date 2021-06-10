const functions = require("firebase-functions");
const admin = require("firebase-admin");
const messaging = admin.messaging()
const database = admin.database()

exports.sendFcm = functions.region('europe-west3').https.onCall(async (data, context) =>{
    checkIfAuth(context)
    const {chatId , title, message} = data
    const roomSnap = await database.ref(`/rooms/${chatId}`).once('value')
    if(!roomSnap.exists()){
        return false
    }
    const roomData = roomSnap.val()

    checkIfAllowed(context, transformToArray(roomData.admins))
    
    const fcmUsers = transformToArray(roomData.fcmUsers)
    const userTokensPromise = fcmUsers.map(user => getUserTokens(user)) 
    const userTokenResults = await Promise.all(userTokensPromise)

    const tokens = userTokenResults.flat()

    if(tokens.length === 0){
        return false
    }
    const fcmMessage = {
        notification: {
            title: `${title} (${roomData.name})`,
            body: message
        },
        tokens
    }

    const batchResponse = await messaging.sendMulticast(fcmMessage)
    const failedTokens = [];

    if (batchResponse.failureCount > 0) {
        batchResponse.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      })
    }

    

    const removePromises = failedTokens.map(token => database.ref(`/fcm_tokens/${token}`).romove())

    return Promise.all(removePromises).catch(err => err.message)
}) 

const checkIfAuth = (context) =>{
    if(!context.auth){
        throw new functions.https.HttpsError('unauthenticated', 'You have to be signed in')
    }
}

const checkIfAllowed = (context, admins) =>{
    if(!admins.includes(context.auth.uid)){
        throw new functions.https.HttpsError('unauthenticated', 'Restricted Access')
    }
}

const transformToArray = (snapVal)=> snapVal ? Object.keys(snapVal) : []

const getUserTokens = async (uid) => {
    const userTokenSnap = await database.ref(`/fcm_tokens`).orderByValue().equalTo(uid).once('value')

    if(!userTokenSnap.hasChildren()){
        return []
    }
    return Object.keys(userTokenSnap.val())
}
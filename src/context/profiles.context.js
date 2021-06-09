import React, {createContext, useState, useContext, useEffect} from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import firebase from 'firebase/app'
import { auth, database } from '../misc/firebase'

const ProfileContext = createContext()

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

export const ProfileProvider = ({children})=>{
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        let UserRef;
        let UserStatusRef;
        const authUnsub = auth.onAuthStateChanged(authObj=>{
            if(authObj){
                UserRef =  database.ref(`/profiles/${authObj.uid}`)
                UserRef.on('value', snapshot=>{
                    const {name, createdAt, avatar} = snapshot.val()
                    const data = {
                        name, 
                        createdAt,
                        avatar,
                        uid: authObj.uid,
                        email: authObj.email
                    }
                    setProfile(data)
                    setIsLoading(false)
                })
                database.ref('.info/connected').on('value', snapshot =>{
                    if (!!snapshot.val() === false) {
                        return;
                    };
                    UserStatusRef = database.ref(`/status/${authObj.uid}`);
                    UserStatusRef.onDisconnect().set(isOfflineForDatabase).then( ()=> {
                        UserStatusRef.set(isOnlineForDatabase);
                    });
                });

            }else{
                if(UserRef){
                    UserRef.off()
                }
                if(UserStatusRef){
                    UserStatusRef.off()
                }
                database.ref('.info/connected').off()
                setProfile(null)
                setIsLoading(false)
            }
        })

        return ()=>{
            authUnsub()
            if(UserRef){
                UserRef.off()
            }
            if(UserStatusRef){
                UserStatusRef.off()
            }
            database.ref('.info/connected').off()
        }

    }, [])

    return <ProfileContext.Provider
    value={{profile, isLoading}}
    >
        {children}
    </ProfileContext.Provider>
}

export const useProfile = ()=> useContext(ProfileContext)
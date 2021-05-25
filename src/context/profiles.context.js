import React, {createContext, useState, useContext, useEffect} from 'react'
import { auth, database } from '../misc/firebase'

const ProfileContext = createContext()

export const ProfileProvider = ({children})=>{
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(()=>{
        let UserRef;
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
            }else{
                if(UserRef){
                    UserRef.off()
                }

                setProfile(null)
                setIsLoading(false)
            }
        })

        return ()=>{
            authUnsub()
            if(UserRef){
                UserRef.off()
            }
        }

    }, [])

    return <ProfileContext.Provider
    value={{profile, isLoading}}
    >
        {children}
    </ProfileContext.Provider>
}

export const useProfile = ()=> useContext(ProfileContext)
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {useCallback} from 'react'
import { Button, Drawer, Icon, Alert } from 'rsuite'
import Dashboard from '.'
import { useModalState, useMediaQuery } from '../../misc/customHooks'
import {auth} from '../../misc/firebase'


const DashboardToggle = () => {

    const {isOpen, open, close} = useModalState()
    const isMobile = useMediaQuery('(max-width: 992px)')

    const onSignOut = useCallback(async ()=>{
        try{
           await auth.signOut()
           Alert.info('Signed Out !', 4000)
           close()
        }catch(err){
            Alert.error(err.message, 4000)
        }
    }, [close])

    return (
        <>
            <Button block color="blue" onClick={open} >
                <Icon icon="dashboard" /> Dashboard
            </Button>
            <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
                {/* <div className="text-right mt-3 mr-3 cursor-pointer" onClick={close}>
                    <Icon icon="angle-left" size="2x" />
                </div> */}
                <Dashboard onSignOut={onSignOut} />
                {/* <Drawer backdrop="true" placement="bottom" show="true" size="xs">
                    <Drawer.Body>
                        upload
                    </Drawer.Body>
                </Drawer> */}
            </Drawer>
        </>
    )
}

export default DashboardToggle

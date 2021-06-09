import React, { useCallback } from 'react';
import { Button, Drawer, Icon, Alert } from 'rsuite';
import Dashboard from '.';
import { isOfflineForDatabase } from '../../context/profiles.context';
import { useModalState, useMediaQuery } from '../../misc/customHooks';
import { auth, database } from '../../misc/firebase';

const DashboardToggle = () => {
    const { isOpen, open, close } = useModalState();
    const isMobile = useMediaQuery('(max-width: 992px)');

    const onSignOut = useCallback(async () => {
       try{
            await database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase)
            await auth.signOut();
            Alert.info('Signed Out !', 4000);
            close();
       }catch(err){
           Alert.error(err.message, 4000)
       }

    }, [close]);

    return (
        <div className="mr-3 ml-3 ">
            <Button block color="blue" onClick={open} >
                <Icon icon="dashboard" /> Dashboard
            </Button>
            <Drawer
                full={isMobile}
                show={isOpen}
                onHide={close}
                placement="left"
            >
                <Dashboard onSignOut={onSignOut} />
            </Drawer>
        </div>
    );
};

export default DashboardToggle;

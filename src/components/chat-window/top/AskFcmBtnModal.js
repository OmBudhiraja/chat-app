import React from 'react';
import { useParams } from 'react-router';
import { IconButton, Icon, Modal, Button } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { useModalState } from '../../../misc/customHooks';
import { auth, database } from '../../../misc/firebase';

const AskFcmBtnModal = () => {
    const { chatId } = useParams();
    const { isOpen, open, close } = useModalState();
    const isRecievingFcm = useCurrentRoom(v => v.isRecievingFcm);

    const onCancel = () => {
        database
            .ref(`rooms/${chatId}/fcmUsers`)
            .child(auth.currentUser.uid)
            .remove();
    };

    const onAccept = () => {
        database
            .ref(`rooms/${chatId}/fcmUsers`)
            .child(auth.currentUser.uid)
            .set(true);
    };

    return (
        <>
            <IconButton
                icon={<Icon icon="podcast" />}
                color="blue"
                appearance={isRecievingFcm ? 'primary' : 'ghost'}
                size="sm"
                circle
                onClick={open}
            />

            <Modal show={isOpen} size="xs" onHide={close} backdrop="static">
                <Modal.Header>
                    <Modal.Title>Notifications Permission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isRecievingFcm ? (
                        <div className="text-center">
                            <Icon
                                className="text-green mb-3"
                                icon="check-circle"
                                size="5x"
                            />
                            <h6>
                                You are currently subscribed to broadcast
                                messages sent by admins of this room.
                            </h6>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Icon
                                className="text-blue mb-3"
                                icon="question-circle"
                                size="5x"
                            />
                            <h6>
                                Do You want to subscribe to broadcast messages
                                sent by admins of this room?
                            </h6>
                        </div>
                    )}
                    <p className="mt-2 font-msg-time">
                        {' '}
                        *To recieve notifications make sure you allow
                        Notifications in the browser.
                    </p>
                    <p>
                        Permission:{' '}
                        {Notification.permission === 'granted' ? (
                            <span className="text-green">Granted</span>
                        ) : (
                            <span className="text-red">Denied</span>
                        )}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {isRecievingFcm ? (
                        <Button onClick={onCancel} color="green">
                            I Changed my mind!
                        </Button>
                    ) : (
                        <Button onClick={onAccept} color="blue">
                            Yes, I do
                        </Button>
                    )}
                    <Button onClick={close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AskFcmBtnModal;

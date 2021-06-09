/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { memo } from 'react';
import { Avatar, Button, Divider, Modal, Whisper, Tooltip, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { formatDate } from '../../../misc/helpers';
import RoomDefaultImg from '../../../images/room-default-img.svg';
import { useModalState } from '../../../misc/customHooks';


const RoomInfoBtnModal = () => {
    const name = useCurrentRoom(v => v.name);
    // const admins = useCurrentRoom(v => v.admins)
    const description = useCurrentRoom(v => v.description);
    const roomAvatar = useCurrentRoom(v => v.roomAvatar);
    const createdAt = useCurrentRoom(v => v.createdAt);
    const { isOpen, open, close } = useModalState();

    const formatedDate = formatDate(createdAt);
    return (
        <>
            <Button className="text-center" onClick={open}>Room Info</Button>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title className="d-inline">
                        Group Info
                    </Modal.Title>
                    <span>
                    <Whisper
                            trigger="hover"
                            placement="autoVerticalStart"
                            speaker={
                                <Tooltip>
                                    {' '}
                                    Only Admin can edit room details from the
                                    Admin panel.
                                </Tooltip>
                            }
                        >
                            <Icon className="ml-2 text-grey" size="lg" icon="lightbulb-o" />
                        </Whisper>
                    </span>
                </Modal.Header>
                <Modal.Body className="custom-scroll p-side">
                    <div className="w-100 text-center">
                        <Avatar
                            className=" mt-2 mb-3 width-200 height-200 img-fullsize "
                            circle
                            src={roomAvatar || RoomDefaultImg}
                        />
                    </div>
                    <h3>{name}</h3>
                    <p>Created at {formatedDate} </p>
                    <Divider />
                    <h6 className="mb-1">Description:</h6>
                    <p>{description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block onClick={close}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default memo(RoomInfoBtnModal);

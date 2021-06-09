import React from 'react';
import { Modal, Button, Divider } from 'rsuite';
import { usePresence } from '../../../misc/customHooks';
import { formatDate } from '../../../misc/helpers';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoModal = ({ profile, isOpen, close, children }) => {
    const { name, avatar, createdAt, uid } = profile;
    const memberSince = new Date(createdAt).toLocaleDateString()
    const presence = usePresence(uid)
    return (
        <div>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <ProfileAvatar style={{ background: '#9A8D8D' }} src={avatar} name={name} className="width-200 height-200 img-fullsize font-huge" />
                    <h4 className="mt-2">{name}</h4>
                    {presence && presence.state === 'online' && (
                        <div>
                            <PresenceDot style={{display:"inline", marginRight: '5px'}} uid={uid} />
                            Online
                        </div>
                    )}
                    {presence && presence.state === 'offline' && (
                        <div>
                            Last Seen: {formatDate(presence.last_changed)}
                        </div>
                    )}
                    <Divider />
                    <p>Member Since {memberSince}</p>
                </Modal.Body>
                <Modal.Footer>
                    {children}
                    <Button block onClick={close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfileInfoModal;

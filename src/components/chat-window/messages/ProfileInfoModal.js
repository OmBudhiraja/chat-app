import React from 'react';
import { Modal, Button } from 'rsuite';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoModal = ({ profile, isOpen, close }) => {
    const { name, avatar, createdAt } = profile;
    const memberSince = new Date(createdAt).toLocaleDateString()
    return (
        <div>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <ProfileAvatar style={{ background: '#9A8D8D' }} src={avatar} name={name} className="width-200 height-200 img-fullsize font-huge" />
                    <h4 className="mt-2">{name}</h4>
                    <p>Member Since {memberSince}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block onClick={close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfileInfoModal;

import React, { memo, useState, useRef } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { useModalState } from '../../../misc/customHooks';
import EditableInput from '../../EditableInput';
import ProfileAvatar from '../../ProfileAvatar';
import defaultRoomImg from '../../../images/room-default-img.svg';
import { database, storage } from '../../../misc/firebase';
import UploadAvatarModal from '../../UploadAvatarModal';
import {getBlob, fileInputTypes, isValidFile } from '../../../misc/helpers'
import DeleteRoom from './DeleteRoom';

const EditRoomBtnDrawer = () => {
    const { isOpen, open, close } = useModalState();
    const name = useCurrentRoom(v => v.name);
    const description = useCurrentRoom(v => v.description);
    const roomAvatar = useCurrentRoom(v => v.roomAvatar);
    const roomId = useCurrentRoom(v => v.id);

    const AvatarEditorState = useModalState()
    const [img, setImg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const avatarEditorRef = useRef();

    const onFileInputChange = e => {
        const currentFiles = e.target.files;
        if (currentFiles.length === 1) {
            const file = currentFiles[0];
            if (isValidFile(file)) {
                setImg(file);
                AvatarEditorState.open();
            } else {
                Alert.warning(`Wrong File Type ${file.type}..`, 4000);
            }
        } else {
            Alert.warning('You cannot select multiple images!');
        }
    };

    const onUploadClick = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas();
        setIsLoading(true);
        try {
            const blob = await getBlob(canvas);
            const avatarFileRef = storage
                .ref(`/roomAvatars/${roomId}`)
                .child('avatar');
            const uploadAvatarResults = await avatarFileRef.put(blob, {
                cacheControl: `public, max-age=${3600 * 24 * 3}`,
            });
            const downloadUrl = await uploadAvatarResults.ref.getDownloadURL();

            await database.ref(`/rooms/${roomId}`).update({
                roomAvatar: downloadUrl,
            });
            Alert.success('Avatar has been updated', 4000);
            setIsLoading(false);
            AvatarEditorState.close();
        } catch (err) {
            Alert.error(err.message, 4000);
            setIsLoading(false);
        }
    };


    const updateData = async (key, value) => {
        const roomRef = database.ref(`/rooms/${roomId}`);
        try {
            await roomRef.update({
                [key]: value,
            });
            Alert.success(`${key} successfully updated`, 4000);
        } catch (err) {
            Alert.error(err.message, 4000);
        }
    };

    const onNameSave = newName => {
        updateData('name', newName);
    };

    const onDescriptionSave = newDes => {
        updateData('description', newDes);
    };

    return (
        <div>
                <Button className="br-circle mr-1" size="sm" appearance="primary" color="green" onClick={open}>
                    A
                </Button>
            <Drawer show={isOpen} onHide={close} placement="right">
                <Drawer.Header>
                    <Drawer.Title>Edit Room Info</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <div className="position-relative width-content-fit mx-auto mb-3">
                        <ProfileAvatar
                            src={roomAvatar || defaultRoomImg}
                            name=""
                            style={{ background: '#9A8D8D' }}
                            className=" mt-3 width-300 height-300 font-huge img-fullsize"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer bg-grey d-flex align-items-center justify-content-center br-circle square-sm position-absolute"
                        >
                            <Icon
                                icon="camera"
                                style={{ color: '#fff' }}
                                size="2x"
                            />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="d-none"
                                accept={fileInputTypes}
                                onChange={onFileInputChange}
                            />
                        </label>
                    </div>
                    <EditableInput
                        initialValue={name}
                        onSave={onNameSave}
                        label={<h6 className="mb-1">Name</h6>}
                        emptyMsg="Name cannot be empty."
                        wrapperClass="mb-3"
                    />
                    <EditableInput
                        componentClass="textarea"
                        rows={5}
                        initialValue={description}
                        onSave={onDescriptionSave}
                        label={<h6 className="mb-1">Description</h6>}
                        emptyMsg="Description cannot be empty."
                        style={{ resize: 'none' }}
                    />
                </Drawer.Body>
                <Drawer.Footer>
                    <DeleteRoom roomAvatar={roomAvatar} />
                </Drawer.Footer>
            </Drawer>

            <UploadAvatarModal
                isOpen={AvatarEditorState.isOpen}
                close={AvatarEditorState.close}
                isLoading={isLoading}
                onUploadClick={onUploadClick}
                avatarEditorRef={avatarEditorRef}
                img={img}
                />

        </div>
    );
};

export default memo(EditRoomBtnDrawer);

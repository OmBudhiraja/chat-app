import React, { memo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, ButtonToolbar, Icon, Alert } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import RoomDefaultImg from '../../../images/room-default-img.svg';
import { useMediaQuery, useModalState } from '../../../misc/customHooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import {getBlob, fileInputTypes, isValidFile } from '../../../misc/helpers'
import UploadAvatarModal from '../../UploadAvatarModal';
import { storage, database } from '../../../misc/firebase';

const Top = () => {
    const name = useCurrentRoom(v => v.name);
    const roomAvatar = useCurrentRoom(v => v.roomAvatar);
    const id = useCurrentRoom(v => v.id);
    const isMobile = useMediaQuery('(max-width: 992px)');

    const {isOpen, close, open} = useModalState()
    const [img, setImg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const avatarEditorRef = useRef();

    const onFileInputChange = e => {
        const currentFiles = e.target.files;
        if (currentFiles.length === 1) {
            const file = currentFiles[0];
            if (isValidFile(file)) {
                setImg(file);
                open();
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
                .ref(`/roomAvatars/${id}`)
                .child('avatar');
            const uploadAvatarResults = await avatarFileRef.put(blob, {
                cacheControl: `public, max-age=${3600 * 24 * 3}`,
            });
            const downloadUrl = await uploadAvatarResults.ref.getDownloadURL();

            await database.ref(`/rooms/${id}`).update({
                roomAvatar: downloadUrl,
            });
            Alert.success('Avatar has been updated', 4000);
            setIsLoading(false);
            close();
        } catch (err) {
            Alert.error(err.message, 4000);
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="d-flex justify-content-between align-items-center text-disappear">
                    <Icon
                        componentClass={Link}
                        to="/"
                        icon="back-arrow"
                        size="2x"
                        className={
                            isMobile
                                ? 'd-inline-block text-black p-0 mr-1 link-unstyled'
                                : 'd-none'
                        }
                    />
                    <Avatar
                        circle
                        src={roomAvatar || RoomDefaultImg}
                        className="mr-2"
                    />
                    <span className="text-disappear">{name}</span>
                </h4>
                <ButtonToolbar className="ws-nowrap">todo</ButtonToolbar>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <span>todo</span>
                <RoomInfoBtnModal />
                <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer"
                >
                   upload room avatar
                    <input
                        type="file"
                        id="avatar-upload"
                        className="d-none"
                        accept={fileInputTypes}
                        onChange={onFileInputChange}
                    />
                </label>
                <UploadAvatarModal
                isOpen={isOpen}
                close={close}
                isLoading={isLoading}
                onUploadClick={onUploadClick}
                avatarEditorRef={avatarEditorRef}
                img={img}
                />
            </div>
        </div>
    );
};

export default memo(Top);

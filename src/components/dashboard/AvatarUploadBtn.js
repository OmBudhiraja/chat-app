import React, { useState, useRef } from 'react';
import { Alert, Icon } from 'rsuite';
import { useProfile } from '../../context/profiles.context';
import { useModalState } from '../../misc/customHooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from '../ProfileAvatar';
import UploadAvatarModal from '../UploadAvatarModal';
import {getBlob, fileInputTypes, isValidFile } from '../../misc/helpers'


const AvatarUploadBtn = () => {
    const { isOpen, open, close } = useModalState();
    const [img, setImg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const avatarEditorRef = useRef();
    const { profile } = useProfile();

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
                .ref(`/profile/${profile.uid}`)
                .child('avatar');
            const uploadAvatarResults = await avatarFileRef.put(blob, {
                cacheControl: `public, max-age=${3600 * 24 * 3}`,
            });
            const downloadUrl = await uploadAvatarResults.ref.getDownloadURL();

            await database.ref(`/profiles/${profile.uid}`).update({
                avatar: downloadUrl,
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
        <div className="mt-3 text-center">
            <div className="position-relative width-content-fit mx-auto">
                <ProfileAvatar
                    src={profile.avatar}
                    name={profile.name}
                    className=" mt-3 width-300 height-300 font-huge img-fullsize"
                />
                <label
                    htmlFor="avatar-upload"
                    className="cursor-pointer bg-grey d-flex align-items-center justify-content-center br-circle square-sm position-absolute"
                >
                    <Icon icon="camera" style={{ color: '#fff' }} size="2x" />
                    <input
                        type="file"
                        id="avatar-upload"
                        className="d-none"
                        accept={fileInputTypes}
                        onChange={onFileInputChange}
                    />
                </label>
            </div>
            <UploadAvatarModal
            isOpen={isOpen}
            close={close}
            isLoading={isLoading}
            onUploadClick={onUploadClick}
            avatarEditorRef={avatarEditorRef}
            img={img}
            />
        </div>
    );
};

export default AvatarUploadBtn;

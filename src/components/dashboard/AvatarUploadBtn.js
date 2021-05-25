import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useProfile } from '../../context/profiles.context';
import { useModalState } from '../../misc/customHooks';
import { database, storage } from '../../misc/firebase';
import ProfileAvatar from '../ProfileAvatar';

const fileInputTypes = '.jpg jpeg .png';
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = file => acceptedFileTypes.includes(file.type);
const getBlob = canvas =>
    new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('File process error.'));
            }
        });
    });

const AvatarUploadBtn = () => {
    const { isOpen, open, close } = useModalState();
    const [img, setImg] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
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
        setIsLoading(true)
        try {
            const blob = await getBlob(canvas);
            const avatarFileRef = storage
                .ref(`/profile/${profile.uid}`)
                .child('avatar');
            const uploadAvatarResults = await avatarFileRef.put(blob, {
                cacheControl: `public, max-age=${3600*24*3}`
            });
            const downloadUrl = await uploadAvatarResults.ref.getDownloadURL()
             
            await database.ref(`/profiles/${profile.uid}`).update({
                avatar: downloadUrl
            })
            Alert.success('Avatar has been updated', 4000)
            setIsLoading(false)
            close()

        } catch (err) {
            Alert.error(err.message, 4000);
            setIsLoading(false)
        }
    };

    return (
        <div className="mt-3 text-center">
            <ProfileAvatar src={profile.avatar} name={profile.name} className="width-300 height-300 font-huge img-fullsize" />
            <div>
                <label
                    htmlFor="avatar-upload"
                    className="d-block cursor-pointer padded"
                >
                    Select new Avatar
                    <input
                        type="file"
                        id="avatar-upload"
                        className="d-none"
                        accept={fileInputTypes}
                        onChange={onFileInputChange}
                    />
                </label>

                <Modal backdrop="static" show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>Adjust and Upload the avatar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="mt-3">
                        <div className="d-flex justify-content-center align-items-center h-100">
                            {img && (
                                <AvatarEditor
                                    ref={avatarEditorRef}
                                    image={img}
                                    width={300}
                                    height={300}
                                    border={10}
                                    borderRadius={250}
                                    rotate={0}
                                />
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="mt-3">
                        <Button appearance="primary" onClick={onUploadClick} disabled={isLoading} >
                            Upload
                        </Button>
                        <Button appearance="subtle" onClick={close} disabled={isLoading} >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AvatarUploadBtn;

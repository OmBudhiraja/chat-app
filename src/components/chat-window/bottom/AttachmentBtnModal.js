import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../misc/customHooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 15;

const AttachmentBtnModal = ({ afterUpload }) => {
    const {chatId} = useParams();
    const { isOpen, open, close } = useModalState();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onChange = fileArr => {
        const filtered = fileArr
            .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
            .slice(0, 5);
        setFileList(filtered);
    };
    const onUploadClick = async () => {
        setIsLoading(true);
        try {
            const uploadPromises = fileList.map(file =>
                storage
                    .ref(`/chat/${chatId}`)
                    .child(Date.now() + file.name)
                    .put(file.blobFile, {
                        cacheControl: `public, max-age=${3600 * 24 * 3}`,
                    })
            );

            const uploadSnapShots = await Promise.all(uploadPromises);

            const shapePromises = uploadSnapShots.map(async snap => ({
                contentType: snap.metadata.contentType,
                name: snap.metadata.name,
                url: await snap.ref.getDownloadURL(),
            }));

            const files = await Promise.all(shapePromises);

            await afterUpload(files);
            close();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 4000);
        }
    };

    return (
        <>
            <InputGroup.Button onClick={open}>
                <Icon icon="attachment" size="lg" />
            </InputGroup.Button>

            <Modal backdrop="static" show={isOpen} onHide={close}>
                <Modal.Header className="p-side">
                    <Modal.Title>Upload Files</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex p-side align-items-center custom-scroll">
                    <Uploader
                        autoUpload={false}
                        action=""
                        onChange={onChange}
                        multiple
                        listType="picture-text"
                        fileList={fileList}
                        className="w-100"
                        disabled={isLoading}
                    />
                </Modal.Body>
                <Modal.Footer className="p-side">
                    {fileList.length > 0 && (
                        <Button
                            disabled={isLoading}
                            block
                            appearance="primary"
                            onClick={onUploadClick}
                        >
                            Send to Chat
                        </Button>
                    )}
                    <div className="text-right mt-2">
                        <small> * only files less than 15mb are allowed.</small>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AttachmentBtnModal;

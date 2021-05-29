import React from 'react'
import AvatarEditor from 'react-avatar-editor';
import {Modal, Button} from 'rsuite'

const UploadAvatarModal = (props) => {
    const {isOpen, close, avatarEditorRef, img, onUploadClick, isLoading} = props
    return (
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
                    <Button
                        appearance="primary"
                        onClick={onUploadClick}
                        disabled={isLoading}
                    >
                        Upload
                    </Button>
                    <Button
                        appearance="subtle"
                        onClick={close}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
    )
}

export default UploadAvatarModal

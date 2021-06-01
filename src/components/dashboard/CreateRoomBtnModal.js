/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useRef, useState } from 'react';
import {
    Alert,
    Button,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    Icon,
    Modal,
    Schema,
} from 'rsuite';
import Firebase from 'firebase/app';
import { useModalState } from '../../misc/customHooks';
import { database } from '../../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
    name: StringType().isRequired('ChatRoom Name is Required').maxLength(15, 'Name must not exceed 20 letters'),
    description: StringType().isRequired('Room Description is Required'),
});

const INITIAL_FORM = {
    name: '',
    description: '',
};

const CreateRoomBtnModal = () => {
    const { isOpen, open, close } = useModalState();
    const [formValue, setFormValue] = useState(INITIAL_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();

    const onFormChange = useCallback(value => {
        setFormValue(value);
    }, []);

    const onSubmit = async () => {
        if (!formRef.current.check()) {
            // eslint-disable-next-line no-useless-return
            return;
        }
        setIsLoading(true);
        const newRoomData = {
            ...formValue,
            createdAt: Firebase.database.ServerValue.TIMESTAMP,
        };
        try {
            await database.ref('rooms').push(newRoomData);
            Alert.success(`${formValue.name} has been created !`)
            setFormValue(INITIAL_FORM)
            setIsLoading(false)
            close()
        } catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 4000);
        }
    };

    return (
        <div className="mt-1">
            <Button block color="green" onClick={open}>
                <Icon icon="creative" /> Create a New Chat Room
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>New Chat Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        fluid
                        onChange={onFormChange}
                        value={formValue}
                        model={model}
                        ref={formRef}
                    >
                        <FormGroup>
                            <ControlLabel>Room Name</ControlLabel>
                            <FormControl
                                name="name"
                                placeholder="Enter Chat name here..."
                                autoComplete="off"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Room Description</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                rows={5}
                                name="description"
                                style={{resize: 'none'}}
                                placeholder="Enter Room Description..."
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>
                        Create{' '}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateRoomBtnModal;

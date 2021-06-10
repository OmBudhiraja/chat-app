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
import { useParams } from 'react-router';
import { useModalState } from '../../../misc/customHooks';
import { functions } from '../../../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
    title: StringType()
        .isRequired('Title is Required')
        .maxLength(15, 'Name must not exceed 20 letters'),
    message: StringType().isRequired('Message is Required'),
});

const INITIAL_FORM = {
    title: '',
    message: '',
};

const SendFcmBtnModal = () => {
    const { isOpen, open, close } = useModalState();
    const [formValue, setFormValue] = useState(INITIAL_FORM);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef();
    const {chatId} = useParams()

    const onFormChange = useCallback(value => {
        setFormValue(value);
    }, []);

    const onSubmit = async () => {
        if (!formRef.current.check()) {
            // eslint-disable-next-line no-useless-return
            return;
        }
        setIsLoading(true);
       try{
           const sendFcm = functions.httpsCallable('sendFcm')
           await sendFcm({chatId, ...formValue})
           setIsLoading(false)
           setFormValue(INITIAL_FORM)
           close()
           Alert.info('Notification has been send!', 5000)

       }catch(err){
           Alert.error(err.message, 5000)
           setIsLoading(false)
       }
    };

    return (
        <>
            <Button appearance="primary" size="xs" onClick={open}>
                <Icon icon="podcast" /> BroadCast Message
            </Button>
            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>Send Notifications to users</Modal.Title>
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
                            <ControlLabel>Title</ControlLabel>
                            <FormControl
                                name="title"
                                placeholder="Enter title here..."
                                autoComplete="off"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Message</ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                rows={5}
                                name="message"
                                style={{ resize: 'none' }}
                                placeholder="Enter Notification message..."
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        block
                        appearance="primary"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        Publish Message
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SendFcmBtnModal;

/* eslint-disable consistent-return */
import React, { useState, useCallback } from 'react';
import { Input, InputGroup, Icon, Alert } from 'rsuite';
// eslint-disable-next-line import/no-extraneous-dependencies
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profiles.context';
import { database } from '../../../misc/firebase';

const assembleMessage = (profile, roomId) => ({
    roomId,
    author: {
        name: profile.name,
        uid: profile.uid,
        createdAt: profile.createdAt,
        ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
});

const Bottom = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { chatId } = useParams();
    const { profile } = useProfile();
    const onInputChange = useCallback(value => {
        setInput(value);
    }, []);

    const onSendClick = async () => {
        if (input.trim() === '') return null;
        const msgData = assembleMessage(profile, chatId);
        msgData.text = input;

        const updates = {};

        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = msgData;
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...msgData,
            messageId,
        };
        setLoading(true);
        try {
            await database.ref().update(updates);
            setInput('');
            setLoading(false);
        } catch (err) {
            setLoading(false);
            Alert.error(err.message, 4000);
        }
    };

    const onKeyDown = e => {
        if (e.keyCode === 13) {
            e.preventDefault();
            onSendClick();
        }
    };

    return (
        <div>
            <InputGroup size="lg">
                <Input
                    placeholder="Write a new message here..."
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                />
                <InputGroup.Button
                    color="blue"
                    appearance="primary"
                    onClick={onSendClick}
                    disabled={loading}
                >
                    <Icon icon="send" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    );
};

export default Bottom;

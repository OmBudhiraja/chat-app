/* eslint-disable consistent-return */
import React, { useState, useCallback } from 'react';
import { Input, InputGroup, Icon, Alert } from 'rsuite';
// eslint-disable-next-line import/no-extraneous-dependencies
import firebase from 'firebase/app';
import { useParams } from 'react-router';
import { useProfile } from '../../../context/profiles.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

const assembleMessage = (profile, roomId) => ({
    roomId,
    author: {
        name: profile.name,
        uid: profile.uid,
        createdAt: profile.createdAt,
        ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
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

        const messageId = database.ref('/messages').push().key;

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

    const afterUpload = useCallback(async files => {

        const updates = {};
        files.forEach(file => {
            const msgData = assembleMessage(profile, chatId);
            msgData.file = file;
            const messageId = database.ref('/messages').push().key;
            updates[`/messages/${messageId}`] = msgData;
        });

        const lastMsgId = Object.keys(updates).pop();
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...updates[lastMsgId],
            messageId: lastMsgId,
        };
        try {
            await database.ref().update(updates);
            
        } catch (err) {
           
            Alert.error(err.message, 4000);
        }
    }, [chatId, profile]);

    return (
        <div>
            <InputGroup size="lg">
                <AudioMsgBtn afterUpload={afterUpload} />
                <AttachmentBtnModal afterUpload={afterUpload} />
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

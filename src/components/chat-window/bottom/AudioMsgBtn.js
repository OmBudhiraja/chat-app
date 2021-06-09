import React, { useCallback, useState } from 'react';
import { Icon, InputGroup, Alert } from 'rsuite';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { storage } from '../../../misc/firebase';

const AudioMsgBtn = ({ afterUpload }) => {
    const { chatId } = useParams();
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const onClick = useCallback(() => {
        setIsRecording(prev => !prev);
    }, []);

    const onUpload = useCallback(
        async recordedBlob => {
            // console.log(recordedBlob.blob);
            setIsUploading(true);
            try {
                const snap = await storage
                    .ref(`/chat/${chatId}`)
                    .child(`audio_${Date.now()}.mp3`)
                    .put(recordedBlob.blob, {
                        cacheControl: `public, max-age=${3600 * 24 * 3}`,
                    });

                const file = {
                    contentType: snap.metadata.contentType,
                    name: snap.metadata.name,
                    url: await snap.ref.getDownloadURL(),
                };

                await afterUpload([file]);
                setIsUploading(false);
            } catch (err) {
                Alert.error(err.message, 4000);
                setIsUploading(false);
            }
        },
        [chatId, afterUpload]
    );

    return (
        <>
            <InputGroup.Button
                onClick={onClick}
                disabled={isUploading}
                className={isRecording ? 'animate-blink' : ''}
            >
                <Icon icon="microphone" />
                <ReactMic
                    record={isRecording}
                    className="d-none"
                    onStop={onUpload}
                    onBlock={()=> Alert.error('Allow microphone to send vioce messages', 4000)}
                    mimeType="audio/mp3"
                />
            </InputGroup.Button>
        </>
    );
};

export default AudioMsgBtn;

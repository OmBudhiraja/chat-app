import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router'
import {Tag} from 'rsuite'
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { database } from '../../../misc/firebase';
import { transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState(null);
    const RoomName = useCurrentRoom(v => v.name)

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0

    useEffect(() => {
        const messagesRef = database.ref('/messages');

        messagesRef.orderByChild('roomId').equalTo(chatId).on('value', snapshot =>{
            const data = transformToArrayWithId(snapshot.val())
            setMessages(data)
        });

        return ()=>{
            messagesRef.off("value")
        }
    }, [chatId]);

    return <div className="msg-list custom-scroll">
        {isChatEmpty && <Tag> You created the group {RoomName}</Tag>}
        {canShowMessages && messages.map(message =>  <MessageItem key={message.id} msg={message} />) }
           
    </div>;
};

export default Messages;

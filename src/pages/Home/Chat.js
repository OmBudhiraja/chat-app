import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import Messages from '../../components/chat-window/messages';
import ChatTop from '../../components/chat-window/top';
import ChatBottom from '../../components/chat-window/bottom';
import { useRooms } from '../../context/rooms.context';
import { CurrentRoomProvider } from '../../context/currentRoom.context';

const Chat = () => {
    const { chatId } = useParams();
    const rooms = useRooms();

    if(!rooms){
        return <Loader center content="Loading..." speed="slow" size="md" vertical />
    }

    const currentRoom = rooms.find(room => room.id === chatId)

    if(!currentRoom){
        return <h6>Chat Id not found</h6>
    }

    const {name, description, roomAvatar, createdAt} = currentRoom

    const currentRoomData = {
        name, description, roomAvatar, createdAt
    }
   

    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className="chat-top">
                <ChatTop />
            </div>
            <div className="chat-middle">
                <Messages />
            </div>
            <div className="chat-bottom">
                <ChatBottom />
            </div>
        </CurrentRoomProvider>
    );
};

export default Chat;

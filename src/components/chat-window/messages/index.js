/* eslint-disable array-callback-return */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { Alert, Tag, Button } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { groupBy, transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
const messagesRef = database.ref('/messages');

const shouldScrollToBottom = (node, threshold = 30)=>{
    const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0

    return percentage > threshold
}

const Messages = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState(null);
    const selfRef = useRef()
    const [limit, setLimit] = useState(PAGE_SIZE);

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;

    const handleAdmin = useCallback(
        async uid => {
            const adminsRef = database.ref(`/rooms/${chatId}/admins`);
            let AlertMsg;
            await adminsRef.transaction(admins => {
                if (admins) {
                    if (admins[uid]) {
                        admins[uid] = null;
                        AlertMsg = 'Admin Permissions Removed';
                    } else {
                        admins[uid] = true;
                        AlertMsg = 'Admin Permissions Granted';
                    }
                }
                return admins;
            });

            Alert.success(AlertMsg, 4000);
        },
        [chatId]
    );

    const handleLike = useCallback(async msgId => {
        const { uid } = auth.currentUser;
        const msgRef = database.ref(`/messages/${msgId}`);
        let AlertMsg;
        await msgRef.transaction(msg => {
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likeCount -= 1;
                    msg.likes[uid] = null;
                    AlertMsg = 'Like Removed';
                } else {
                    msg.likeCount += 1;
                    if (!msg.likes) {
                        msg.likes = {};
                    }
                    msg.likes[uid] = true;
                    AlertMsg = 'Message Liked';
                }
            }
            return msg;
        });

        Alert.success(AlertMsg, 4000);
    }, []);

    const loadMessages = useCallback((limitToLast) => {
        const node = selfRef.current
        messagesRef.off();
        messagesRef
            .orderByChild('roomId')
            .equalTo(chatId)
            .limitToLast(limitToLast || PAGE_SIZE)
            .on('value', snapshot => {
                const data = transformToArrayWithId(snapshot.val());
                setMessages(data);
                if(shouldScrollToBottom(node)){
                    node.scrollTop = node.scrollHeight
                }
            });

            setLimit(prev => prev + PAGE_SIZE)
    }, [chatId]);

    const onLoadMore = useCallback(()=>{
        const node = selfRef.current
        const oldHeight = node.scrollHeight
        loadMessages(limit)
        setTimeout(()=>{
            node.scrollTop = node.scrollHeight - oldHeight
        }, 1000)
        
    }, [limit, loadMessages])


    useEffect(() => {
        const node = selfRef.current
        loadMessages()
        setTimeout(()=>{
            node.scrollTop = node.scrollHeight
        }, 1000)


        return () => {
            messagesRef.off('value');
        };
    }, [loadMessages]);

    const renderMsgs = () => {
        const groups = groupBy(messages, msgItem =>
            new Date(msgItem.createdAt).toDateString()
        );
        const items = [];
       
        Object.keys(groups).map(date => {
            const dateTag = (
                <div
                    className="text-center mt-3 mb-3"
                    style={{ cursor: 'context-menu' }}
                    key={date}
                >
                    {' '}
                    <Tag>{date}</Tag>{' '}
                </div>
            );
            items.push(dateTag);
            const msgs = groups[date].map(message => (
                <MessageItem
                    msg={message}
                    key={message.id}
                    handleLike={handleLike}
                    handleAdmin={handleAdmin}
                />
            ));
            items.push(...msgs);
        });

        return items;
    };

    return (
        <div ref={selfRef} className="msg-list custom-scroll"> 
            {
                messages && messages.length >= PAGE_SIZE && (
                    <div className="text-center mb-3 mt-3">
                         <Button color="green" onClick={onLoadMore}>Load More</Button>
                    </div>
                )
            }
            {isChatEmpty && <div className="text-center mt-3 mb-3" style={{ cursor: 'context-menu' }}><Tag> No Messages yet</Tag></div>}
            {canShowMessages && renderMsgs()}
        </div>
    );
};

export default Messages;

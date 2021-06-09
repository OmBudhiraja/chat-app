import React from 'react';
import TimeAgo from 'timeago-react';
import { Avatar, Divider, Icon } from 'rsuite';
import RoomDefaultImg from '../../images/room-default-img.svg';

const RoomItem = ({ room }) => {
    const { createdAt, name, roomAvatar, lastMessage } = room;
    return (
        <div className="d-flex align-items-center">
            <div className="mr-3">
                <Avatar size="md" circle src={roomAvatar || RoomDefaultImg} />
            </div>
            <div className="w-100" style={{ overflow: 'hidden' }}>
                <div className="d-flex justify-content-between align-items-center ">
                    <h5 className="text-disappear font-bolder font-large">
                        {name}
                    </h5>
                    <TimeAgo
                        datetime={
                            lastMessage
                                ? new Date(lastMessage.createdAt)
                                : new Date(createdAt)
                        }
                        className="font-normal text-black-45"
                    />
                </div>
                <div
                    className="d-flex align-items-center text-black-70 font-xs"
                    style={{ marginTop: '2px' }}
                >
                    {lastMessage ? (
                        <div className="text-disappear mr-1">
                            <span className="italic">
                                {lastMessage.author.name}:
                            </span>
                            {lastMessage.text && (
                                <span className="text-disappear">
                                    &nbsp;{lastMessage.text}
                                </span>
                            )}

                            {lastMessage.file && (
                                <>
                                    {lastMessage.file.contentType.includes(
                                        'image'
                                    ) ||
                                    lastMessage.file.contentType.includes(
                                        'video'
                                    ) ||
                                    lastMessage.file.contentType.includes(
                                        'audio'
                                    ) ? (
                                        <span className="text-disappear">
                                            &nbsp;
                                            {lastMessage.file.contentType.includes('image') && <><Icon icon="image" /> Photo</> }
                                            {lastMessage.file.contentType.includes('video') && <><Icon icon="video-camera" /> Video</> }
                                            {lastMessage.file.contentType.includes('audio') && <><Icon icon="microphone" /> Audio</> }
                                        </span>
                                    ) : (
                                        <span className="text-disappear">
                                            &nbsp;{lastMessage.file.name}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <span>No messages yet...</span>
                    )}
                </div>
                <Divider className="small-divider" />
            </div>
        </div>
    );
};

export default RoomItem;

import React from 'react';
import TimeAgo from 'timeago-react';
import { Avatar, Divider } from 'rsuite';
import RoomDefaultImg from '../../images/room-default-img.svg';

const RoomItem = ({room}) => {
    const {createdAt, name, roomAvatar} = room
    return (
        <div className="d-flex align-items-center">
            <Avatar
                size="md"
                circle
                src={roomAvatar || RoomDefaultImg}
                className="mr-3"
            />
            <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="text-disappear">{name}</h4>
                    <TimeAgo datetime={new Date(createdAt)} className="font-normal text-black-45" />
                </div>
                <div className="d-flex align-items-center text-black-70">
                    <span>No messages yet...</span>
                </div>
                <Divider className="small-divider" />
            </div>
        </div>
    );
};

export default RoomItem;

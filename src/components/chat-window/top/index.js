import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import RoomDefaultImg from '../../../images/room-default-img.svg';
import { useMediaQuery } from '../../../misc/customHooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const Top = () => {
    const name = useCurrentRoom(v => v.name);
    const roomAvatar = useCurrentRoom(v => v.roomAvatar);
    const isMobile = useMediaQuery('(max-width: 992px)');
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="d-flex justify-content-between align-items-center">
                    <Icon
                        componentClass={Link}
                        to="/"
                        icon="back-arrow"
                        size="2x"
                        className={
                            isMobile
                                ? 'd-inline-block text-black p-0 mr-1 link-unstyled'
                                : 'd-none'
                        }
                    />
                    <Avatar
                        circle
                        src={roomAvatar || RoomDefaultImg}
                        className="mr-2"
                    />
                    <span className="text-disappear">{name}</span>
                </h4>
                <ButtonToolbar className="ws-nowrap">todo</ButtonToolbar>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <span>todo</span>
                <RoomInfoBtnModal />
            </div>
        </div>
    );
};

export default memo(Top);

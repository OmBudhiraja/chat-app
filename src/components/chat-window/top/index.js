import React, { memo} from 'react';
import { Link } from 'react-router-dom';
import { Avatar, ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import RoomDefaultImg from '../../../images/room-default-img.svg';
import { useMediaQuery } from '../../../misc/customHooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import EditRoomBtnDrawer from './EditRoomBtnDrawer';


const Top = () => {
    const name = useCurrentRoom(v => v.name);
    const roomAvatar = useCurrentRoom(v => v.roomAvatar);
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const isMobile = useMediaQuery('(max-width: 992px)');

    
    return (
        <div className="d-flex align-items-center">
            <Icon
                componentClass={Link}
                to="/"
                icon="back-arrow"
                size="2x"
                className={
                    isMobile
                        ? 'd-inline-block text-black p-0 link-unstyled'
                        : 'd-none'
                }
            />
            <Avatar
                circle
                src={roomAvatar || RoomDefaultImg}
                className="mr-1"
            />
                <div className="d-flex justify-content-between align-items-center" style={{flex: 1}}>
                    <h4 className="d-flex justify-content-between align-items-center text-disappear">
                        <span className="text-disappear">{name}</span>
                    </h4>
                    <div className="d-flex align-items-center" >
                    <ButtonToolbar className="ws-nowrap">
                        {isAdmin && <EditRoomBtnDrawer />}
                    </ButtonToolbar>
                    <RoomInfoBtnModal />
                    </div>
                </div>
                
                
        </div>
    );
};

export default memo(Top);

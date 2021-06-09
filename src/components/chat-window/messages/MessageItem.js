/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Button, Icon } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/currentRoom.context';
import { useModalState } from '../../../misc/customHooks';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import IconBtnControl from './IconBtnControl';
import ImageBtnModal from './ImageBtnModal';
import ProfileInfoModal from './ProfileInfoModal';

const renderFileMsg = (file)=>{
    if(file.contentType.includes('image')){
        return <div className="height-250">
            <ImageBtnModal src={file.url} fileName={file.name} />
        </div>
    }

    if(file.contentType.includes('video')){
        return <div className="">
            <video src={file.url} type={file.contentType} controls height="100%" width="100%" >
            This video type is not supported in your device.
        </video>
        </div>
    }

    if(file.contentType.includes('audio')){
        return <audio controls>
            <source src={file.src} type="audio.mp3" />
        </audio>
    }

    return <a href={file.url} className="mr-3 word-break" target="_blank" rel="noopener noreferrer">Download {file.name}</a>
}

const MessageItem = ({ msg, handleAdmin, handleLike }) => {
    const { text, createdAt, author, likes, likeCount, file } = msg;
    const myMessage = auth.currentUser.uid === author.uid;
    const { isOpen, close, open } = useModalState();

    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);
    const isMsgAuthorAdmin = admins.includes(author.uid);

    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid)

    return (
        <div>
            {myMessage ? (
                <div
                    className="text-right pt-2 pb-1"
                    style={{ width: '90%', marginLeft: 'auto' }}
                >
                    <div className="d-inline-block text-left bg-myMsg p-side pt-1 pb-1 msg-curved">
                        {text && (<span className="font-xs mr-3 word-break">{text}</span>)}
                        {file && renderFileMsg(file)}
                        <span
                            className="font-msg-time position-down"
                            style={{ float: 'right' }}
                        >
                            <TimeAgo
                                datetime={createdAt}
                                className="font-normal text-black-45"
                            />
                        </span>
                    </div>
                    { likeCount > 0 && (
                    <div className=" text-msg-name mr-2 font-msg-name">
                        <Icon style={{marginRight: '8px', color: 'red'}} icon="heart"/>
                        <span>{`${likeCount}`} {Number(likeCount) === 1 ? 'user' : 'users' } liked this!</span>
                    </div>
                    )}
                </div>
            ) : (
                <div className="text-left pt-2 pb-1" style={{ width: '90%' }}>
                    <div className="d-flex align-items-center">
                        <div className="mr-1 position-relative">
                            <ProfileAvatar
                                onClick={open}
                                src={author.avatar}
                                name={author.name}
                                size="sm"
                                className="cursor-pointer"
                                style={{ background: '#9A8D8D' }}
                            />
                            <PresenceDot style={{ position: 'absolute', bottom: '0%', right: '-2px' }} uid={author.uid} />
                        </div>
                        <div className="bg-white d-inline-block p-side pt-1 pb-1 msg-curved">
                            <div className="d-flex justify-content-between align-items-center">
                                <span
                                    className="text-msg-name mr-2 font-msg-name cursor-pointer"
                                    onClick={open}
                                >
                                    {author.name}
                                </span>
                                <span>
                                    <IconBtnControl
                                        isVisible
                                        iconName={isLiked ? 'heart': 'heart-o'}
                                        tooltip="Like this"
                                        badgeContent={likeCount}
                                        onClick={() => handleLike(msg.id)}
                                    />
                                </span>
                            </div>
                            <div>
                                {text && (
                                    <span className="font-xs mr-3 word-break">
                                        {text}
                                    </span>
                                )}
                                {file && renderFileMsg(file)}
                                <span
                                    className="font-msg-time position-down"
                                    style={{ float: 'right' }}
                                >
                                    <TimeAgo
                                        datetime={createdAt}
                                        className="font-normal text-black-45"
                                    />
                                </span>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}
            <ProfileInfoModal profile={author} close={close} isOpen={isOpen}>
                {isAdmin && (
                    <Button
                        block
                        color="blue"
                        onClick={() => handleAdmin(author.uid)}
                        className="mb-1"
                    >
                        {isMsgAuthorAdmin
                            ? 'Remove admin Permission'
                            : 'Grant Admin Permissions'}
                    </Button>
                )}
            </ProfileInfoModal>
        </div>
    );
};
export default MessageItem;

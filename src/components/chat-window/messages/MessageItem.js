/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import TimeAgo from 'timeago-react';
import { useModalState } from '../../../misc/customHooks';
import { auth } from '../../../misc/firebase';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoModal from './ProfileInfoModal';

// eslint-disable-next-line arrow-body-style
const MessageItem = ({ msg }) => {
    const { text, createdAt, author } = msg;
    const myMessage = auth.currentUser.uid === author.uid;
    const {isOpen, close, open} = useModalState()
    return (
        <div>
            {myMessage ? (
                <div className="text-right pt-2" style={{width: '90%', marginLeft: 'auto'}}>
                    <div className="d-inline-block text-left bg-myMsg p-side pt-1 pb-1 msg-curved">
                        <span className="font-xs mr-3 word-break">{text}</span>
                        <span className="font-msg-time position-down" style={{float: 'right'}}>
                            <TimeAgo
                                datetime={createdAt}
                                className="font-normal text-black-45"
                            />
                        </span>
                    </div>
                </div>
            ) : (
                <div className="text-left pt-2"  style={{width: '90%'}}>
                   <div className="d-flex align-items-center">
                    <div>
                        <ProfileAvatar onClick={open} src={author.avatar} name={author.name} size="sm" className="mr-1 cursor-pointer" style={{ background: '#9A8D8D' }} />
                    </div>
                   <div className="bg-white d-inline-block p-side pt-1 pb-1 msg-curved">
                        <span className="d-block text-msg-name font-msg-name cursor-pointer" onClick={open}>
                            {author.name}
                        </span>
                        <div >
                            <span className="font-xs mr-3 word-break">{text}</span>
                            <span className="font-msg-time position-down" style={{float: 'right'}} >
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
            <ProfileInfoModal profile={author} close={close} isOpen={isOpen} />
        </div>
    );
};
export default MessageItem;

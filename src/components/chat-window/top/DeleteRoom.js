import React from 'react'
import { useHistory, useParams } from 'react-router'
import { Button, Modal, Icon } from 'rsuite'
import { useModalState } from '../../../misc/customHooks'
import { database, storage } from '../../../misc/firebase'

const DeleteRoom = ({roomAvatar}) => {
    const {isOpen, open, close} = useModalState()
    const {chatId} = useParams()
    const history = useHistory()

    const handleDeleteRoom = async ()=>{
        const updates = {}
        const getRoomMsgs = database.ref(`/messages`).orderByChild('roomId').equalTo(chatId).once('value')
        const getRoom = database.ref(`/rooms/${chatId}`).once('value')
        if(roomAvatar){
         storage.ref(`/roomAvatars/${chatId}/avatar`).delete() 
        }

        const [msgSnap, roomSnap] = await Promise.all([getRoomMsgs, getRoom])
        
        msgSnap.forEach(snap => {
            updates[`/messages/${snap.key}`] = null
        })
        
        updates[`/rooms/${roomSnap.key}`] = null

        await database.ref().update(updates)

        history.push('/')
    }
    return (
        <div>
          <Button block color="red" onClick={open}>Delete Room</Button>   
          <Modal  backdrop="static" show={isOpen} onHide={close} size="xs">
              <Modal.Header>
                  <Modal.Title>Are you Sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body className="d-flex align-items-center">
              <Icon
              icon="remind"
              style={{
                color: '#ffb300',
                fontSize: 18,
                marginRight: 15
              }}
            />
                  <p>You could not recover any room data , once Room is <b>deleted</b>!</p>
              </Modal.Body>
              <Modal.Footer>
                  <Button appearance="primary" onClick={handleDeleteRoom}>Sure</Button>
                  <Button appearance="subtle" onClick={close}>Cancel</Button>
              </Modal.Footer>
          </Modal>
        </div>
    )
}

export default DeleteRoom

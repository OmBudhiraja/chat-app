import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types'
import { Button, Drawer, Divider, Alert} from 'rsuite'
import { useProfile } from '../../context/profiles.context'
import EditableInput from '../EditableInput'
import { database } from '../../misc/firebase'
import ProviderBlock from './ProviderBlock'
import AvatarUploadBtn from './AvatarUploadBtn'
import { getUserUpdates } from '../../misc/helpers'



const Dashboard = ({onSignOut}) => {
    const {profile} = useProfile()

    const onSave = async (newData)=>{
      try{
        const updates = await getUserUpdates(profile.uid, "name", newData, database)
        await database.ref().update(updates)

        Alert.success('Nickname has been Updated !', 4000)
      }catch(err){
          Alert.error(err.message, 4000)
      }
    }

    return (
        <>
            <Drawer.Header className="p-side">
                <Drawer.Title className="text-grey">
                    Dashboard        
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="custom-scroll p-side">
                <h3>Hey, {profile.name}</h3>
                <ProviderBlock />
                <Divider />
                <EditableInput
                name="nickname"
                initialValue={profile.name}
                onSave={onSave}
                label={<h6 className="mb-2">Nickname</h6>}
                />
                <AvatarUploadBtn />
            </Drawer.Body>
            <Drawer.Footer className="p-side">
                <Button block color="red" onClick={onSignOut}>Sign Out</Button>
            </Drawer.Footer>
        </>
    )
}

Dashboard.propTypes = {
    onSignOut: PropTypes.func.isRequired,
}

export default Dashboard

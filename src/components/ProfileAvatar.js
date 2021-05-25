/* eslint-disable arrow-body-style */
import React from 'react'
import { Avatar } from 'rsuite'
import { getInitials } from '../misc/helpers'

const ProfileAvatar = ({name, ...avatarProps}) => {
    return (
        <Avatar circle {...avatarProps}>
            {getInitials(name)}
        </Avatar>
    )
}

export default ProfileAvatar

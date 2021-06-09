import React from 'react'
import { Badge, Icon, IconButton } from 'rsuite'

const ConditionalBadge = ({condition, children}) => condition ?
 <Badge content={condition}>{children}</Badge> 
 : children

const IconBtnControl = (props) => {
    const {isVisible, tooltip, badgeContent, iconName, onClick, ...rmProps} = props
    return (
        <div className="ml-2" style={{visibility: isVisible ? 'visible': 'hidden'}}>
            <ConditionalBadge condition={badgeContent}>
                
                <IconButton
                {...rmProps}
                onClick={onClick}
                circle
                size="xs"
                icon={<Icon icon={iconName} style={{color: 'red'}} />}
                />
            </ConditionalBadge>
        </div>
    )
}

export default IconBtnControl

import React from 'react';
import { Badge } from 'rsuite';
import { usePresence } from '../misc/customHooks';

const PresenceDot = ({ uid, style={}, }) => {
    const presence = usePresence(uid);
    return (
        <div style={style}>
            {presence && presence.state === 'online' && (
                <Badge style={{ background: '#807434' }} />
            )}
        
        </div>
    );
};

export default PresenceDot;

import { useEffect, useState } from 'react';

import RLink from '../Links/Link';
import Comment from '../Comments/Comment';

export default function UserActivityList({ activity }) {
    const [toRender, setToRender] = useState([]);
    const [isHidden, setIsHidden] = useState(false);
    const getActivityToRender = () => {
        let arr = [];
        for (let i = 0; i < activity.length; i++) {
            const item = activity[i];
            if (item.kind === 't3') {
                arr.push(<RLink link={item} key={item.data.id}/>);
            } else if (item.kind === 't1') {
                arr.push(<Comment 
                            comment={item} 
                            key={item.data.id} 
                            isUserPage={true}
                        />);
            }
        }
        return arr;
    }
    useEffect(() => {
        const activityToRender = getActivityToRender();
        setToRender(activityToRender);
        setIsHidden(activityToRender.length < 1);
    }, [activity]);

    return (
        <div className="listContainer">
            {isHidden ? <p>Nothing here. I guess it's hidden or something.</p> : toRender}
        </div>
    );
}
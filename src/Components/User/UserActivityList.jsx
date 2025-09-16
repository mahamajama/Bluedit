import { useEffect, useState } from 'react';

import RLink from '../Links/Link';
import UserActivityComment from './UserActivityComment';
import Comment from '../Comments/Comment';

export default function UserActivityList({ activity }) {
    const [toRender, setToRender] = useState([]);
    const getActivityToRender = () => {
        let arr = [];
        for (let i = 0; i < activity.length; i++) {
            const item = activity[i];
            if (item.kind === 't3') {
                arr.push(<RLink link={item} key={item.data.id}/>);
            } else if (item.kind === 't1') {
                arr.push(<Comment comment={item} key={item.data.id} />);
            }
        }
        return arr;
    }
    useEffect(() => {
        setToRender(getActivityToRender());
    }, [activity]);

    return (
        <div className="listContainer">
            {toRender}
        </div>
    );
}
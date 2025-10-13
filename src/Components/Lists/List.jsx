import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import RLink from '../Links/Link';
import SubredditListing from '../Subreddits/SubredditListing';
import Comment from '../Comments/Comment';

import { selectType } from './listsSlice';

const listItemLimit = 25;

export default function List({ list }) {
    const [toRender, setToRender] = useState([]);

    const type = useSelector(selectType);

    const getItemsToRender = () => {
        let arr = [];
        for (let i = 0; i < list.length; i++) {
            if (i >= listItemLimit) break;

            const item = list[i];

            switch (item.kind) {
                case 't1':
                    arr.push(
                        <Comment comment={item} isUserPage={type === 'user'} key={item.data.id} />
                    );
                    break;
                case 't3':
                    arr.push(
                        <RLink link={item} key={item.data.id}/>
                    );
                    break;
                case 't5':
                    arr.push(
                        <SubredditListing data={item.data} key={item.data.id}/>
                    );
                    break;
                default:
                    break;
            }
        }
        return arr;
    }

    useEffect(() => {
        setToRender(getItemsToRender());
    }, [list]);
    
    return (
        <>
            {toRender}
        </>
    );
}
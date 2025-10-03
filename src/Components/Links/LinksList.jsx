
import RLink from './Link';

import styles from './Links.module.css';

export default function LinksList({ links }) {
    return (
        <div className={`listContainer`}>
            {links.map(link => {
                return (
                    <RLink 
                        link={link} 
                        key={link.data.id}
                    />
                );
            })}
        </div>
    );
}
import { Link } from 'react-router';
import Search from '../Search/Search';

export default function Header({ collapsed, onSearchFocused, onSearchBlurred }) {

    return (
        <div id="headerContent">
            <div className={`logoContainer ${collapsed ? 'collapsed' : ''}`}>
                <Link to='/' id="logo" className={collapsed ? 'collapsed' : ''} draggable={false} viewTransition>BLUEDIT</Link>
            </div>
            <Search collapsed={collapsed} onFocus={onSearchFocused} onBlur={onSearchBlurred} />
        </div>
    );
}
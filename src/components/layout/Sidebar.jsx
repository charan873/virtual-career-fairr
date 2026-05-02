import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/career-fair" activeClassName="active">Career Fair</NavLink>
                    </li>
                    <li>
                        <NavLink to="/networking" activeClassName="active">Networking</NavLink>
                    </li>
                    <li>
                        <NavLink to="/company-booths" activeClassName="active">Company Booths</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" activeClassName="active">Profile</NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
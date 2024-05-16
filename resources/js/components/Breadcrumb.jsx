import { Link, usePage } from '@inertiajs/react';
import React from 'react';

function Breadcrumb() {
    const { breadcrumb } = usePage().props;
    // Calculate window location once
    const currentLocation = window.location.href;

    return breadcrumb && (
        <ol className="breadcrumb m-0">
            {breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                    {item.url === currentLocation ? (
                        <li className="breadcrumb-item active">
                            <a>{item.title}</a>
                        </li>
                    ) : (
                        <li className="breadcrumb-item">
                            <Link href={item.url}>{item.title}</Link>
                        </li>
                    )}
                </React.Fragment>
            ))}
        </ol>
    );
}

export default Breadcrumb;

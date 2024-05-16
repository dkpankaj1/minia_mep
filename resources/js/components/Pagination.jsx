import { Link } from "@inertiajs/react";
import React from "react";

function Pagination({links}) {
    console.log(links)
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                {links.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className={`page-item ${item.active && "active"}`}
                        >
                            <Link className="page-link" href={item.url}>
                                {item.label
                                    .replace(/&laquo;/g, "«")
                                    .replace(/&raquo;/g, "»")}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Pagination;

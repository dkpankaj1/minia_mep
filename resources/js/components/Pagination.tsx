import { TLinksType } from "@/types/links.type";
import { Link } from "@inertiajs/react";
import React from "react";

interface IPageProps {
    links: Array<TLinksType>;
}
function Pagination({ links }: IPageProps) {
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                {links.map((item, index) => {
                    return (
                        <li
                            key={index}
                            className={
                                item.active ? "page-item active" : "page-item"
                            }
                        >
                            <Link
                                className="page-link"
                                href={item.url}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        item.label === "&laquo; Previous"
                                            ? "«"
                                            : item.label === "Next &raquo;"
                                            ? "»"
                                            : item.label,
                                }}
                            ></Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default Pagination;

import { Link } from "@inertiajs/react";
import React from "react";
import { TLinksType } from "@/types/links.type";
interface PaginationProps {
    links: Array<TLinksType>;
}
const Pagination: React.FC<PaginationProps> = ({ links }) => {
    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                {links.map((item, index) => (
                    <li
                        key={index}
                        className={`page-item ${item.active && "active"}`}
                    >
                        <Link
                            className="page-link"
                            href={item.url}
                            dangerouslySetInnerHTML={{ __html: item.label }} // Safely render HTML entities
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;

import Card from "@/components/Cards/Card";
import React, { FC, HTMLAttributes, ReactNode } from "react";
interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    subTitle?: string;
    count?: number;
    buttons?: ReactNode;
    children: ReactNode;
}

const TableContainer: FC<TableContainerProps> = ({
    title,
    subTitle,
    count,
    buttons,
    children,
}) => {
    return (
        <Card>
            <Card.Body>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="mb-3">
                            <h5 className="card-title">
                                {title}
                                {count && (
                                    <span className="text-muted fw-normal ms-2">
                                        ({count})
                                    </span>
                                )}
                            </h5>
                            {subTitle && (
                                <p className="card-title-desc">{subTitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                            <div>
                                {/* @/components/CreateBtn.tsx */}
                                {buttons}
                            </div>
                        </div>
                    </div>
                </div>
                {children}
            </Card.Body>
        </Card>
    );
};

export default TableContainer;

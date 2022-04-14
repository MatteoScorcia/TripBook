import React, { MouseEventHandler } from "react";
import classNames from "classnames";

export function Card(props: {
    className?: string;
    logo?: React.ReactNode;
    title?: React.ReactNode;
    children?: React.ReactNode;
    actions?: React.ReactNode;
    iconAction?: React.ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}) {
    const { className, logo, title, children, actions, iconAction, onClick } = props;

    const cardClass = classNames(
        "flex flex-col bg-white hover:drop-shadow-xl rounded-lg text-emphasis p-4",
        className
    );

    return (
        <div className={cardClass} onClick={onClick}>
            <div className="flex items-center space-x-2">
                {logo && <div className="">{logo}</div>}
                <div className="flex-1">{title}</div>
                {iconAction && <div>{iconAction}</div>}
            </div>
            <div className="mt-4">{children}</div>
            <div className="flex-1" />
            <div className="flex space-x-1 mt-4">{actions}</div>
        </div>
    );
}

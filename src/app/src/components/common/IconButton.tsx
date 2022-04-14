import React from "react";
import classNames from "classnames";

export function IconButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const { children, className, ...rest } = props;

    const btnClass = classNames(
        "hover:bg-secondary-dark rounded-full p-2 transition-colors duration-150",
        className
    );

    return (
        <button {...rest} className={btnClass}>
            {children}
        </button>
    );
}

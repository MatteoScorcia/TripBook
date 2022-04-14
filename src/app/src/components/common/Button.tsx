import React from "react";
import classNames from "classnames";

export function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & { accent: boolean; disabled?: string }
) {
    const { children, accent, className, disabled, ...rest } = props;

    const btnClass = classNames(
        "rounded-md font-bold shadow-sm text-emphasis px-3 py-1 flex items-center space-x-1",
        accent ? "bg-primary-light hover:bg-primary-normal" : "bg-secondary-normal hover:bg-secondary-dark",
        className
    );

    return (
        <button {...rest} disabled={disabled} className={btnClass}>
            {children}
        </button>
    );
}

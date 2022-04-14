import React from "react";
import ReactModal from "react-modal";
import { Card } from "./Card";

export function Modal(props: {
    children?: React.ReactNode;
    title?: string;
    actionButtons?: JSX.Element;
    show: boolean;
    onClickOutsideModal?: any;
}) {
    // const {children, header, footer, show, onClickOutsideModal} = props;

    ReactModal.setAppElement("#root");

    return (
        <ReactModal
            isOpen={props.show}
            onRequestClose={props.onClickOutsideModal}
            shouldCloseOnOverlayClick={true}
            style={{
                overlay: {
                    zIndex: 1000,
                    backgroundColor: "#000000cf",
                },
                content: {
                    padding: "0",
                    border: "none",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    margin: "auto",
                    width: "max-content",
                    height: "max-content",
                    backgroundColor: "transparent",
                    minWidth: "16rem",
                    maxWidth: "100vw",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                },
            }}
        >
            <Card
                className="w-full max-w-[24rem] min-h-[16rem] break-words"
                title={<span className="uppercase">{props.title}</span>}
                actions={props.actionButtons}
            >
                {props.children}
            </Card>
        </ReactModal>
    );
}

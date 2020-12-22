import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// const modalRoot = document.querySelector("#modal-root") as HTMLElement;

let externalWindow;

interface Props {
    children: JSX.Element;
    onClose: () => void;
    graphIsInPortal: boolean;
}

const Modal = (props: Props) => {
    const { children, onClose, graphIsInPortal } = props;
    const el = useRef(document.createElement("div"));

    useEffect(()=> {
        if (!graphIsInPortal && externalWindow) {
            onClose();
            externalWindow.close();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphIsInPortal])

    useEffect(() => {
        if (!graphIsInPortal) {
            externalWindow = undefined;
            return;
        }

        if (externalWindow === undefined ) { 
            externalWindow = window.open('', '', 'width=890,height=460,left=200,top=200');
        }           
        externalWindow.document.body.appendChild(el.current);

        const onbeforeunloadFn = () => {
            onClose();
            externalWindow.close();
            externalWindow.document.body.removeChild(el.current);
            externalWindow.removeEventListener('beforeunload', onbeforeunloadFn);
            externalWindow = undefined;
        }
    
        externalWindow.addEventListener('beforeunload', onbeforeunloadFn);

        return () => {
            if (externalWindow) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                externalWindow.document.body.removeChild(el.current);
                externalWindow.removeEventListener('beforeunload', onbeforeunloadFn);
            }
            //externalWindow.close();
        }
    }, [graphIsInPortal, onClose]);

    if (!graphIsInPortal) {
        return null;
    }
    return createPortal(children, el.current);
};

export default Modal;
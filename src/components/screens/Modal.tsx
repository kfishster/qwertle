/* eslint-disable react/jsx-no-comment-textnodes */
import { XIcon } from '@heroicons/react/outline';
import { SyntheticEvent } from "react";

type Props = {
    close: () => void;
    children: JSX.Element | JSX.Element[];
};

const stopPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
}

export const Modal = ({ children, close }: Props) => {
    return (
        <div className="absolute h-full w-full flex justify-center items-center" onClick={close}>
            <div onClick={stopPropagation} className="flex flex-col items-center rounded-xl md:w-2/3 w-11/12 max-h-3/4 overflow-auto px-4 bg-zinc-600/90 font-mono text-mainframe-green pb-12">
                <button onClick={close} className="top-0 right-0 mt-4 self-end"><XIcon className="h-8" /></button>
                {children}
            </div>
        </div>
    );
};
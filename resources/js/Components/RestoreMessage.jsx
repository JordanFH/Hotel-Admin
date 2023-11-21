import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

export default ({
    onRestore,
    children,
    show = false,
    closeable = true,
    onClose = () => {},
}) => {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };
    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="alert"
                static
                className="fixed bottom-0 left-0 sm:bottom-6 sm:left-6 ml-0 sm:ml-64 flex items-center border-2 border-blue-600/75 dark:border-blue-500/75 w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="flex items-center ml-auto space-x-2">
                        <div className="text-sm font-normal">{children}</div>
                        <button
                            onClick={onRestore}
                            className="focus:outline-none text-sm font-medium text-blue-600 p-1.5 hover:bg-blue-100 rounded-lg dark:text-blue-500 dark:hover:bg-gray-700"
                        >
                            Restaurar
                        </button>
                        <button
                            type="button"
                            className="focus:outline-none bg-white text-gray-400 hover:text-gray-900 rounded-lg flex items-center justify-center hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                            aria-label="Close"
                            onClick={close}
                        >
                            <span className="sr-only">Cerrar</span>
                            <FontAwesomeIcon
                                icon={faClose}
                                className="text-xl"
                            />
                        </button>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};

import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head, Link, useForm, usePage} from "@inertiajs/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import Modal from "@/Components/Modal";
import axios from 'axios';
import {Toast} from "primereact/toast";
import InputError from "@/Components/InputError";

export default function Dashboard(props) {
    const {roles} = usePage().props;
    const [data, setData] = useState(roles);
    const {data: dataRoles, setData: setRoles, errors, post, processing} = useForm({
        id: "", name: "Admin",
    });

    console.log(data)
    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [itemSeleccionado, setItemSeleccionado] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalEditOpen, setModalEditOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(route("roles.store"), dataRoles);
            const newRole = response.data;
        ;

            // Actualizas la lista de detalles
            const updated = [...data, newRole];
            setData(updated);
        } catch (error) {
            // Manejar el error
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(route("roles.update", idSeleccionado), {
                name: itemSeleccionado,
            });
            const updateRole = response.data; // Esto debería ser la categoría actualizada
            console.log("Categoría actualizada:", updateRole);
            // Busca la posición de la categoría original en el array data
            const index = data.findIndex(role => role.id === idSeleccionado);

            if (index !== -1) {
                // Reemplaza la categoría original con la categoría actualizada en la misma posición
                const updatedData = [...data];
                updatedData[index] = updateRole;
                setData(updatedData);
            }
        }catch (error) {
            console.error("Error en la actualización:", error);
        }
    }

    const destroy = async (id) => {
        try {
            const response = await axios.delete(`/roles/${id}`);
            closeModal();

            // Actualizar la lista de categorías después de eliminar
            const updated = data.filter((role) => role.id !== id);
            setData(updated);
            const mensaje = "El elemento se eliminó correctamente.";
            showSuccess(mensaje);
        } catch (error) {
            if (error.response.status === 500) {

                const mensaje = "El elemento está siendo utilizado.";

                // Mostrar un mensaje de error indicando que la categoría no se puede eliminar
                showError(mensaje);
            } else {
                // Manejar otros errores
                console.error(error);
                setIsButtonDisabled(false);
                showError("Ocurrió un error al eliminar el elemento.");
            }
            closeModal();
        }
    };

    // actualizar data con useEffect
    useEffect(() => {
        setData(roles);
    }, [roles]);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const toast = useRef(null);

    const showSuccess = (message) => {
        toast.current.show({
            severity: 'success', summary: 'Éxito', detail: message, life: 2000
        });
    }

    const showError = (message) => {
        toast.current.show({severity: 'error', summary: 'Error', detail: message, life: 3000});
    }

    const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

    const openModalCreate = () => {
        setIsModalCreateOpen(true);
    };

    const closeModalCreate = () => {
        setIsModalCreateOpen(false);
    };
    const closeModalEdit = () => {
        setModalEditOpen(false);
    }

    const openModalEdit = (id, name) => {
        setIdSeleccionado(id);
        setItemSeleccionado(name);
        setModalEditOpen(true);
    }

    return (<Authenticated
        auth={props.auth}
        errors={props.errors}
        header={<h2
            className="relative sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Roles
        </h2>}
    >
        <Head title="Roles"/>

        <Toast ref={toast} position="bottom-center"/>

        <div className="py-8">
            <div className="max-w-8xl mx-auto px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none hover:bg-green-600"
                                href={route("roles.create")}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="mr-2"
                                    beat
                                />
                                Crear Rol
                            </Link>
                        </div>

                        <div
                            className="rounded-lg border border-gray-300 dark:border-gray-700 relative overflow-x-auto">
                            <table className="rounded-lg border-collapse lg:table-fixed w-full">
                                <thead>
                                <tr className="border-b border-gray-300 dark:border-gray-700 dark:bg-gray-900 bg-gray-200">
                                    <th className="uppercase text-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3 w-20">
                                        N°
                                    </th>
                                    <th className="uppercase border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3">
                                        Roles
                                    </th>
                                    <th className="uppercase border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3">
                                        Permisos
                                    </th>
                                    <th className="uppercase text-center border-b border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3">
                                        Opciones
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map(({id, name}, index) => (<tr
                                    className="[&:not(:last-child)]:border-b dark:border-gray-700 border-gray-300"
                                    key={index}
                                >
                                    <td className="border-r text-center dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {index + 1}
                                    </td>
                                    <td className="border-r truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {name}
                                    </td>
                                    <td className="border-r truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {
                                            // lista de permisos
                                        }
                                    </td>
                                    <td className="text-center dark:border-gray-700 border-gray-300 px-4 py-2">
                                        {/*<Link*/}
                                        {/*    tabIndex="1"*/}
                                        {/*    className="w-15 sm:w-auto m-1 xl:px-6 px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"*/}
                                        {/*    type="button"*/}
                                        {/*    href={route("categorias.edit", id)}*/}
                                        {/*>*/}
                                        {/*    <FontAwesomeIcon*/}
                                        {/*        icon={faPencilAlt}*/}
                                        {/*    />*/}

                                        {/*    <span className="ml-0 xl:ml-2 hidden xl:inline-block">*/}
                                        {/*        Editar*/}
                                        {/*    </span>*/}
                                        {/*</Link>*/}
                                        <button
                                            onClick={() => {
                                                setIdSeleccionado(id);
                                                setItemSeleccionado(name);
                                                openModal();
                                            }}
                                            tabIndex="-1"
                                            type="button"
                                            className="w-15 sm:w-auto m-1 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                            />

                                            <span className="ml-0 xl:ml-2 hidden xl:inline-block">
                                                Eliminar
                                            </span>
                                        </button>

                                    </td>
                                </tr>))}
                                {data.length === 0 && (<tr>
                                    <td
                                        className="px-6 py-4 text-center px-4 py-2 text-gray-900 dark:text-gray-100"
                                        colSpan="4"
                                    >
                                        No se encontraron
                                        roles.
                                    </td>
                                </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            show={isModalCreateOpen}
            onClose={closeModalCreate}
        >
            <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                        <div
                            className="mt-3 text-left sm:mt-0">
                            <div className="text-center items-center mb-6">
                               <div className="flex justify-center">
                                   <div
                                       className="mb-3 mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                       <FontAwesomeIcon
                                           icon={faPlus}
                                           className="text-purple-700"
                                       />
                                   </div>
                               </div>
                                <h3 className="sm:mt-0 mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Añadiendo Role
                                </h3>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Nombre
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        label="name"
                                        name="name"
                                        autoFocus
                                        value={data.name}
                                        onChange={(e) => setRoles("name", e.target.value)}
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-1 mb-3 px-4 py-3 pb-4 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        onClick={() => {
                            // Recargar la página
                            closeModalCreate();
                        }}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${isButtonDisabled && "opacity-25"}`}
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={() => {

                            closeModalCreate();
                        }}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
        <Modal
            show={isModalEditOpen}
            onClose={closeModalEdit}
        >
            <form onSubmit={handleUpdate}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div>
                        <div
                            className="mt-3 text-left sm:mt-0">
                            <div className="text-center items-center mb-6">
                                <div className="flex justify-center">
                                    <div
                                        className="mb-3 mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            className="text-purple-700"
                                        />
                                    </div>
                                </div>
                                <h3 className="sm:mt-0 mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    Editanto Role
                                </h3>
                            </div>

                            <div className="flex flex-col">
                                <div className="mb-4">
                                    <label className="text-gray-900 dark:text-gray-100">
                                        Nombre
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        label="name"
                                        name="name"
                                        autoFocus
                                        value={itemSeleccionado}
                                        onChange={(e) => setItemSeleccionado(e.target.value)}
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="mt-1 mb-3 px-4 py-3 pb-4 sm:px-6 sm:flex sm:flex-row-reverse justify-center">
                    <button
                        type="submit"
                        disabled={isButtonDisabled}
                        onClick={() => {
                            // Recargar la página
                           closeModalEdit()
                        }}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm ${isButtonDisabled && "opacity-25"}`}
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={() => {

                            closeModalEdit()
                        }}
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
        <Modal
            show={isModalOpen}
            onClose={closeModal}
        >
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div
                        className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-700"
                        />
                    </div>
                    <div
                        className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Eliminar
                            role:{" "}
                            <b className="break-words text-red-500">
                                "
                                {itemSeleccionado}
                                "
                            </b>
                        </h3>
                        <div className="mt-2">
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                ¿Está
                                seguro
                                de
                                que
                                desea
                                eliminar
                                este role?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="px-4 py-3 pb-4 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                    onClick={() => {
                        if (!isButtonDisabled) {
                            destroy(idSeleccionado);
                        }
                    }}
                    disabled={isButtonDisabled}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isButtonDisabled && "opacity-25"}`}
                    tabIndex="-1"
                >
                    Eliminar
                </button>
                <button
                    onClick={() => {
                        closeModal();
                    }}
                    tabIndex="1"
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    Cancelar
                </button>
            </div>
        </Modal>
    </Authenticated>);
}

import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head, Link, useForm, usePage} from "@inertiajs/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import Modal from "@/Components/Modal";
import axios from 'axios';

export default function Dashboard(props) {
    const {users} = usePage().props;
    const [data, setData] = useState(users);

    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [itemSeleccionado, setItemSeleccionado] = useState("");
    const [tipoSeleccionado, setTipoSeleccionado] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleUpdate = async (e) => {
        //console.log("upadte",idSeleccionado + " " + tipoSeleccionado + itemSeleccionado);
        e.preventDefault()
        try {
            const response = await axios.put(route("users.update", idSeleccionado), {
                nombre: itemSeleccionado,
                tipo: tipoSeleccionado
            });
            const updatedCategoria = response.data; // Esto debería ser la categoría actualizada
            console.log("Usuario actualizado:", updatedCategoria);
            // Busca la posición de la categoría original en el array data
            const index = data.findIndex(categoria => categoria.id === idSeleccionado);

            if (index !== -1) {
                // Reemplaza la categoría original con la categoría actualizada en la misma posición
                const updatedData = [...data];
                updatedData[index] = updatedCategoria;
                setData(updatedData);
            }
        }catch (error) {
            console.error("Error en la actualización:", error);
        }
    }

    const destroy = async (id) => {
        try {
            console.log(await axios.delete(`/users/${id}`));
            // Manejar la eliminación exitosa
            closeModal();

            // Actualizar la lista de categorías después de eliminar
            const updated = data.filter((user) => user.id !== id);
            setData(updated);
        } catch (error) {
            if (error.response.status === 500) {
                // Manejar errores de validación
                console.error(error.response.data);
            } else {
                // Manejar otros errores
                console.error(error);
                setIsButtonDisabled(false);
            }
            closeModal();
        }
    };

    // actualizar data con useEffect
    useEffect(() => {
        setData(users);
    }, [users]);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (<Authenticated
        auth={props.auth}
        errors={props.errors}
        header={<h2
            className="relative sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Usuarios
        </h2>}
    >
        <Head title="Usuarios"/>

        <div className="py-8">
            <div className="max-w-8xl mx-auto px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <div className="flex items-center justify-between mb-6">
                            <Link
                                className="px-6 py-2 text-white bg-green-500 rounded-md focus:outline-none hover:bg-green-600"
                                href={route("users.create")}
                            >
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="mr-2"
                                    beat
                                />
                                Crear Usuario
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
                                        usuario
                                    </th>
                                    <th className="uppercase border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3">
                                        Email
                                    </th>
                                    <th className="uppercase text-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3">
                                        Roles
                                    </th>
                                    <th className="uppercase text-center border-b border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 px-4 py-3">
                                        Opciones
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map(({id, name, email, roles}, index) => (<tr
                                    className="[&:not(:last-child)]:border-b dark:border-gray-700 border-gray-300"
                                    key={index}
                                >
                                    <td className="border-r text-center dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {index + 1}
                                    </td>
                                    <td className="border-r truncate dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {name}
                                    </td>
                                    <td className="border-r dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {email}
                                    </td>
                                    <td className="border-r text-center dark:border-gray-700 border-gray-300 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {roles.map(({name}, index) => (<span
                                            key={index}
                                            className="inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-green-100 bg-green-600 rounded-full"
                                        >
                                            {name}
                                        </span>))}
                                    </td>
                                    <td className="text-center dark:border-gray-700 border-gray-300 px-4 py-2">
                                        <Link
                                            tabIndex="1"
                                            className="w-15 sm:w-auto m-1 xl:px-6 px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                                            type="button"
                                            href={route("users.edit", id)}
                                        >
                                            <FontAwesomeIcon
                                                icon={faPencilAlt}
                                            />

                                            <span className="ml-0 xl:ml-2 hidden xl:inline-block">
                                                Editar
                                            </span>
                                        </Link>
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
                                        No se encontraron usuarios.
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
                            usuario:{" "}
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
                                este
                                usuario?
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

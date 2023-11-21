import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard(props) {
    const { data, setData, errors, post, processing } = useForm({
        nombre: "",
        empresa: "",
        dni: "",
        ruc: "",
        telefono: "",
        correo: "",
        direccion: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        // console.log(data);
        post(route("clientes.store"));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Agregar Cliente
                </h2>
            }
        >
            <Head title="Clientes" />

            <div className="py-8">
                <div className="max-w-8xl mx-auto px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none"
                                    href={route("clientes.index")}
                                >
                                    <FontAwesomeIcon
                                        icon={faBackward}
                                        className="mr-2"
                                    />
                                    Regresar
                                </Link>
                            </div>

                            <form name="createForm" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Nombre y Apellidos
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            label="Nombre y Apellidos"
                                            name="nombre"
                                            autoFocus
                                            value={data.nombre}
                                            onChange={(e) =>
                                                setData(
                                                    "nombre",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.nombre}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Empresa
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            label="Empresa"
                                            name="empresa"
                                            value={data.empresa}
                                            onChange={(e) =>
                                                setData(
                                                    "empresa",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.empresa}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-4 sm:flex block">
                                        <div className="w-full sm:mb-0 mb-4 mr-2">
                                            <label className="text-gray-900 dark:text-gray-100">
                                                DNI
                                            </label>
                                            <input
                                                type="text"
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                label="DNI"
                                                name="dni"
                                                maxLength="8"
                                                value={data.dni}
                                                onChange={(e) =>
                                                    setData("dni", e.target.value)
                                                }
                                            />
                                            <InputError
                                                message={errors.dni}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label className="text-gray-900 dark:text-gray-100">
                                                RUC
                                            </label>
                                            <input
                                                type="text"
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                label="RUC"
                                                name="ruc"
                                                maxLength="11"
                                                value={data.ruc}
                                                onChange={(e) =>
                                                    setData("ruc", e.target.value)
                                                }
                                            />
                                            <InputError
                                                message={errors.ruc}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 sm:flex block">
                                        <div className="w-full sm:mb-0 mb-4 mr-2">
                                            <label className="text-gray-900 dark:text-gray-100">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                label="Telefono"
                                                name="telefono"
                                                value={data.telefono}
                                                onChange={(e) =>
                                                    setData(
                                                        "telefono",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.telefono}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label className="text-gray-900 dark:text-gray-100">
                                                Correo
                                            </label>
                                            <input
                                                type="email"
                                                className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                                label="Correo"
                                                name="correo"
                                                autoComplete="email"
                                                value={data.correo}
                                                onChange={(e) =>
                                                    setData(
                                                        "correo",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.correo}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            label="Dirección"
                                            name="direccion"
                                            value={data.direccion}
                                            onChange={(e) =>
                                                setData(
                                                    "direccion",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.direccion}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-7 py-2 font-bold text-white bg-green-500 hover:bg-green-600 rounded ${
                                            processing && "opacity-25"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

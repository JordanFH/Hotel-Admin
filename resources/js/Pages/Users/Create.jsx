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
        tipo: "Producto",
    });

    function handleSubmit(e) {
        e.preventDefault();
        // console.log(data);
        post(route("categorias.store"));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Crear Usuario
                </h2>
            }
        >
            <Head title="Usuarios" />

            <div className="py-8">
                <div className="max-w-8xl mx-auto px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none"
                                    href={route("categorias.index")}
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
                                            Nombre
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            label="Nombre"
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
                                            Tipo
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            name="tipo"
                                            errors={errors.tipo}
                                            onChange={(e) =>
                                                setData("tipo", e.target.value)
                                            }
                                            value={data.tipo}
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="Producto">
                                                Producto
                                            </option>
                                            <option value="Servicio">
                                                Servicio
                                            </option>
                                        </select>
                                        <InputError
                                            message={errors.tipo}
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

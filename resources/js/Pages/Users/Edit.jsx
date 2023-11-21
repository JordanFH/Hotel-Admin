import React, {useState} from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faSave } from "@fortawesome/free-solid-svg-icons";
import InputError from "@/Components/InputError";

export default function Dashboard(props) {
    const { user, roles } = usePage().props;
    const [dataP, setDataP] = useState(roles);
    const { data, setData, put, errors, processing } = useForm({
        role: "",
    });

    function handleSubmit(e) {
        e.preventDefault();
        // console.log(data);
        put(route("users.update", user.id));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Editar Usuario
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
                                    href={route("users.index")}
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
                                            Rol a asigna al usuario {user.name}
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select
                                            name="role"
                                            errors={errors.role}
                                            value={user.role}
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                        >
                                            <option value="">Selecciona un rol</option> {/* Opción en blanco */}
                                            {dataP.map((role) => (
                                                <option key={role.id}> {/* Asigna una clave única */}
                                                    {role.name} {/* Usar llaves para interpolar el valor */}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-6 py-2 font-bold text-white bg-green-500 hover:bg-green-600 rounded ${
                                            processing && "opacity-25"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                        Actualizar
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

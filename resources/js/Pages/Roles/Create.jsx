import React, { useState } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard(props) {
    const { permissions } = usePage().props;
    const [dataP, setDataP] = useState(permissions);
    const { data, setData, errors, post, processing } = useForm({
        permissions: [],
        name: "",
    });
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

    const handleCheckboxChange = (permiso) => {
        // Verifica si el permiso ya está en la lista de seleccionados
        if (permisosSeleccionados.includes(permiso)) {
            // Si ya está, lo eliminamos
            setPermisosSeleccionados(
                permisosSeleccionados.filter((p) => p !== permiso)
            );
            setData(
                "permissions",
                permisosSeleccionados.filter((p) => p !== permiso)
            );
        } else {
            // Si no está, lo agregamos
            setPermisosSeleccionados([...permisosSeleccionados, permiso]);
            setData("permissions", [...permisosSeleccionados, permiso]);
        }
    };

    function handleSubmit(e) {
        e.preventDefault();
        // console.log(data);
        post(route("roles.store"));
    }

    function getPermissionCategories(permissions) {
        const categories = new Set();

        permissions.forEach((permission) => {
            const category = permission.name.split(".")[0];
            categories.add(category);
        });

        return Array.from(categories);
    }

    function groupPermissions1(permissions) {
        const excludedPermissions = [
            "profile.edit",
            "profile.update",
            "profile.destroy",
        ];

        const groupedPermissions = {};

        permissions.forEach((permission) => {
            const category = permission.name.split(".")[0];

            if (!excludedPermissions.includes(permission.name)) {
                if (!groupedPermissions[category]) {
                    groupedPermissions[category] = [];
                }

                groupedPermissions[category].push(permission);
            }
        });

        return groupedPermissions;
    }

    function groupPermissions(permissions) {
        const excludedPermissions = [
            "profile.edit",
            "profile.update",
            "profile.destroy",
        ];

        const groupedPermissions = {};

        permissions.forEach((permission) => {
            let category = permission.description.split(' ');

            if (category.length >= 2) {
                category = category[1];
            }

            if (!excludedPermissions.includes(permission.name)) {
                if (!groupedPermissions[category]) {
                    groupedPermissions[category] = [];
                }

                groupedPermissions[category].push(permission);
            }
        });

        return groupedPermissions;
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Crear Rol
                </h2>
            }
        >
            <Head title="Roles" />

            <div className="py-8">
                <div className="max-w-8xl mx-auto px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none"
                                    href={route("roles.index")}
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
                                            Nombre del rol a crear
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            className="mt-1 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                                            label="name"
                                            name="name"
                                            autoFocus
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="text-gray-900 dark:text-gray-100">
                                            Listas de Permisos:
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </label>
                                        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 grid-flow-row gap-4">
                                            {Object.entries(
                                                groupPermissions(dataP)
                                            ).map(([category, permissions]) => (
                                                <div key={category}>
                                                    <br />
                                                    <b className="dark:text-sky-500 text-sky-600">
                                                        {category}
                                                    </b>
                                                    {permissions.map(
                                                        (permission) => (
                                                            <li
                                                                key={permission.id}
                                                                className="text-gray-900 dark:text-gray-100 list-none"
                                                            >
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        value={
                                                                            permission.id
                                                                        }
                                                                        checked={permisosSeleccionados.includes(
                                                                            permission.id
                                                                        )}
                                                                        onChange={() =>
                                                                            handleCheckboxChange(
                                                                                permission.id
                                                                            )
                                                                        }
                                                                        className="mr-2"
                                                                    />
                                                                    {
                                                                        permission.description
                                                                    }
                                                                </label>
                                                            </li>
                                                        )
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* <div className="text-gray-900 dark:text-gray-100">
                                        <h3>Permisos seleccionados:</h3>
                                        <ul className="ml-5 list-disc">
                                            {permisosSeleccionados.map((id) => (
                                                <li key={id}>
                                                    {
                                                        permissions.find(
                                                            (permiso) =>
                                                                permiso.id ===
                                                                id
                                                        ).name
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                    </div> */}
                                </div>
                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-7 py-2 font-bold text-white bg-green-500 hover:bg-green-600 rounded ${processing && "opacity-25"
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

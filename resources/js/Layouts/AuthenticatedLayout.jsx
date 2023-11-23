import React, { useEffect, useState } from "react";
import logo from "../../assets/hotel-logo.png";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import Switcher from "@/Components/DarkMode";
import AppLink from "@/Components/AppLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBox,
    faClipboardList,
    faClose,
    faHome,
    faTags,
    faTools,
    faUser,
    faUserGear,
    faUserGroup,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "react-responsive";
import NProgress from "nprogress";

import { getUserInfo } from "../Utils/userInfoUtils";

export default function Authenticated({ auth, header, children }) {


    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const [isSmallScreen, setIsSmallScreen] = useState(
        useMediaQuery({ maxDeviceWidth: 639 })
    );

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 639px)");
        setIsSmallScreen(mediaQuery.matches);
        const handler = () => setIsSmallScreen(mediaQuery.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handlePanelOpen = () => {
        setIsPanelOpen(true);
    };

    const handlePanelClose = () => {
        setIsPanelOpen(false);
    };

    useEffect(() => {
        function handleLoad() {
            if (isSmallScreen) {
                setIsPanelOpen(false);
            } else {
                setIsPanelOpen(true);
            }
        }

        window.addEventListener("load", handleLoad);
    });

    let progressTimeout;

    function stopProgress() {
        clearTimeout(progressTimeout); // Limpiar el tiempo de espera
        NProgress.done(); // Ocultar la barra de progreso
    }

    useEffect(() => {
        // Simular un retraso en la carga
        setTimeout(() => {
            stopProgress();
        }, 250); // Establecer un tiempo de espera de 3 segundos (solo para fines de demostración)
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="sm:ml-64 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center justify-start">
                                <button
                                    data-drawer-target="logo-sidebar"
                                    data-drawer-toggle="logo-sidebar"
                                    aria-controls="logo-sidebar"
                                    type="button"
                                    onClick={handlePanelOpen}
                                    className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-300 dark:focus:bg-gray-900 transition duration-150 ease-in-out"
                                >
                                    <span className="sr-only">Abrir Panel</span>
                                    <FontAwesomeIcon
                                        icon={faBars}
                                        className="p-1 text-2xl"
                                    />
                                </button>
                                <div className="hidden sm:flex md:mr-24">
                                    <img
                                        src={logo}
                                        className="h-10 mr-2"
                                        alt="ILEG Logo"
                                    />
                                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                                        Hotel Admin
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="mr-4 hidden sm:flex sm:items-center sm:ml-6">
                                <div className="ml-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                                >
                                                    {auth.user.name}

                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Cerrar Sesión
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                            <Switcher />
                        </div>

                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-300 dark:focus:bg-gray-900 transition duration-150 ease-in-out"
                            >
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="p-1 text-2xl"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {auth.user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {auth.user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                active={route().current("profile.edit")}
                            >
                                Perfil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                active={route().current("logout")}
                                as="button"
                            >
                                Cerrar Sesión
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {isPanelOpen && (
                <div
                    className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handlePanelClose}
                    aria-hidden="true"
                ></div>
            )}

            {(!isSmallScreen || isPanelOpen) && (
                <React.Fragment>
                    <aside
                        id="logo-sidebar"
                        className={`fixed top-0 left-0 z-40 w-64 h-screen sm:pt-0 pt-4 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
                            isSmallScreen && !isPanelOpen
                                ? "-translate-x-full"
                                : ""
                        }`}
                        aria-label="Sidebar"
                    >
                        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-5">
                                {/* <div className="sm:mt-5 mt-0 flex md:mr-24">
                                    <img
                                        src={logo}
                                        className="h-10"
                                        alt="ILEG Logo"
                                    />
                                </div> */}
                                <button
                                    data-drawer-target="logo-sidebar"
                                    data-drawer-toggle="logo-sidebar"
                                    aria-controls="logo-sidebar"
                                    type="button"
                                    onClick={handlePanelClose}
                                    className="sm:hidden flex items-center justify-center rounded-md text-gray-800 dark:text-white focus:outline-none focus:bg-gray-300 dark:focus:bg-gray-900 transition duration-150 ease-in-out"
                                >
                                    <span className="sr-only">
                                        Cerrar Panel
                                    </span>
                                    <FontAwesomeIcon
                                        icon={faClose}
                                        className="text-2xl"
                                    />
                                </button>
                            </div>

                            <ul className="space-y-2">
                                <li>
                                    <AppLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faHome}
                                            className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                        />
                                        <span className="ml-3">Dashboard</span>
                                    </AppLink>
                                </li>
                                <hr className="border-gray-800 dark:border-gray-400" />
                                <li>
                                    <AppLink
                                        href={route("categorias.index")}
                                        active={route()
                                            .current()
                                            .includes("categorias")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTags}
                                            className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                        />
                                        <span className="ml-3">Categorías</span>
                                    </AppLink>
                                </li>
                                <li>
                                    <AppLink
                                        href={route("productos.index")}
                                        active={route()
                                            .current()
                                            .includes("productos")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faBox}
                                            className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                        />
                                        <span className="ml-3">Productos</span>
                                    </AppLink>
                                </li>
                                <li>
                                    <AppLink
                                        href={route("servicios.index")}
                                        active={route()
                                            .current()
                                            .includes("servicios")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTools}
                                            className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                        />
                                        <span className="ml-3">Servicios</span>
                                    </AppLink>
                                </li>
                                <hr className="border-gray-800 dark:border-gray-400" />
                                <li>
                                    <AppLink
                                        href={route("clientes.index")}
                                        active={route()
                                            .current()
                                            .includes("clientes")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUsers}
                                            className="text-sm text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                        />
                                        <span className="ml-3">Clientes</span>
                                    </AppLink>
                                </li>
                                <hr className="border-gray-800 dark:border-gray-400" />
                                <li>
                                    <AppLink
                                        href={route("cotizaciones.index")}
                                        active={route()
                                            .current()
                                            .includes("cotizaciones")}
                                    >
                                        <FontAwesomeIcon
                                            icon={faClipboardList}
                                            className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                        />
                                        <span className="ml-3">
                                            Cotizaciones
                                        </span>
                                    </AppLink>
                                </li>

                                {auth.user.role === "Admin" && (
                                    <React.Fragment>
                                        <li>
                                            <AppLink
                                                href={route("usuarios.index")}
                                                active={route()
                                                    .current()
                                                    .includes("usuarios")}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUserGroup}
                                                    className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                                />
                                                <span className="ml-3">
                                                    Usuarios
                                                </span>
                                            </AppLink>
                                        </li>
                                        <hr className="border-gray-800 dark:border-gray-400" />
                                        <li>
                                            <AppLink
                                                href={route("roles.index")}
                                                active={route()
                                                    .current()
                                                    .includes("roles")}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faUserGear}
                                                    className="text-xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white w-6 h-6"
                                                />
                                                <span className="ml-3">
                                                    Roles
                                                </span>
                                            </AppLink>
                                        </li>
                                    </React.Fragment>
                                )}
                            </ul>
                        </div>
                    </aside>
                </React.Fragment>
            )}

            {header && (
                <header className="sm:ml-64 bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="sm:ml-64">{children}</main>
        </div>
    );
}

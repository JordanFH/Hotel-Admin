import { Link, Head } from "@inertiajs/react";
import background from "../../assets/background.jpg";
import logo from "../../assets/hotel-logo.png";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel } from "@fortawesome/free-solid-svg-icons";

export default function Welcome(props) {
    const date = new Date();
    const hours = date.getHours();
    let greeting;

    if (hours < 12) {
        greeting = "Buenos días";
    } else if (hours >= 12 && hours < 19) {
        greeting = "Buenas tardes";
    } else {
        greeting = "Buenas noches";
    }

    function useDarkSide() {
        const [theme, setTheme] = useState(
            localStorage.theme && localStorage.theme !== "null"
                ? localStorage.theme
                : window.matchMedia &&
                  window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
        );
        const colorTheme = theme === "dark" ? "light" : "dark";

        useEffect(() => {
            const root = window.document.documentElement;
            root.classList.remove(colorTheme);
            root.classList.add(theme);
            localStorage.setItem("theme", theme);
        }, [theme, colorTheme]);

        return [colorTheme, setTheme];
    }

    const [colorTheme, setTheme] = useDarkSide();
    const [darkSide, setDarkSide] = useState(colorTheme === "light");

    const handleLoad = () => {
        setDarkSide(true);
    };

    return (
        <>
            <Head title="Bienvenido" />
            <div
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    height: "100vh",
                }}
                className="relative flex justify-center items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900"
                onLoad={handleLoad}
            >
                <div className="text-center max-w-8xl mx-auto p-6 p-8">
                    <div className="grid grid-cols-1 gap-6 gap-8">
                        <div className="p-6 bg-white dark:bg-gray-800/50 dark:bg-gradient-to-bl from-gray-700/50 via-transparent dark:ring-1 dark:ring-inset dark:ring-white/5 rounded-lg shadow-2xl shadow-gray-500/20 dark:shadow-none flex motion-safe:hover:scale-[1.01] transition-all duration-250">
                            <div>
                                <img
                                    src={logo}
                                    className="flex mx-auto py-4"
                                    alt="Hotel logo"
                                    width="175px"
                                />
                                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                                    Hotel Admin
                                </h2>

                                <p className="text-center mt-6 text-gray-500 dark:text-gray-200">
                                    {props.auth.user ? (
                                        <>
                                            {greeting}, has iniciado sesión.
                                            Puedes ingresar <br /> al sistema.
                                        </>
                                    ) : (
                                        <>
                                            {greeting}, debes iniciar sesión
                                            para poder ingresar <br /> al
                                            sistema.
                                        </>
                                    )}
                                </p>
                                <div className="sm:flex">
                                    {props.auth.user ? (
                                        <Link
                                            className="px-5 py-3 mx-auto sm:w-auto w-full mt-6 flex items-center justify-center bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 text-center"
                                            href={route("dashboard")}
                                        >
                                            Ingresar al sistema
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                className="px-5 py-3 mx-auto sm:w-auto w-full mt-6 flex items-center justify-center bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 text-center"
                                                href={route("login")}
                                            >
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                className="px-5 py-3 mx-auto sm:w-auto w-full mt-3 sm:mt-6 flex items-center items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 false"
                                                href={route("register")}
                                            >
                                                Registrarse
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
}

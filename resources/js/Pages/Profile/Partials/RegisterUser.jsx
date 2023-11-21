import { Link, useForm, usePage } from "@inertiajs/react";

export default function RegisterUser({ mustVerifyEmail, status, className }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Registrar Usuario
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Registrar el perfil de un nuevo usuario y la dirección de
                    correo electrónico de su cuenta.
                </p>
            </header>

            <button className="mt-6 flex items-center bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 false">
                <Link className="px-4 py-2" href={route("register")}>
                    Registrar
                </Link>
            </button>
        </section>
    );
}

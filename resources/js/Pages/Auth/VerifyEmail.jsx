import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Verificar Correo" />

            <div className="text-justify mb-4 text-gray-600 dark:text-gray-400">
                <b className="block text-center">¡Gracias por registrarte!</b>
                <br />
                Antes de comenzar, verifique su correo en el enlace que le
                enviamos a su cuenta. Si no recibió ningún correo, haga clic en
                el botón reenviar.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    Se ha enviado un nuevo enlace de verificación a su correo
                    electrónico.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Cerrar Sesión
                    </Link>
                    <PrimaryButton className="ml-4" disabled={processing}>
                        Reenviar Correo
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}

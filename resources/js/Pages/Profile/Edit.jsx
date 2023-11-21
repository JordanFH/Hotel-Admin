import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="sm:ml-0 ml-3 font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Perfil
                </h2>
            }
        >
            <Head title="Perfil" />

            <div className="py-8">
                <div className="max-w-8xl mx-auto px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <UpdatePasswordForm />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

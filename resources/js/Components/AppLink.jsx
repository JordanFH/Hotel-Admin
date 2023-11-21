import { Link } from "@inertiajs/react";

export default function AppLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const bgColor = active ? (darkMode ? "dark:bg-gray-700 bg-gray-200" : "dark:bg-gray-700 bg-gray-200") : "";

    return (
        <Link
            {...props}
            className={
                "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 " +
                bgColor +
                className
            }
        >
            {children}
        </Link>
    );
}

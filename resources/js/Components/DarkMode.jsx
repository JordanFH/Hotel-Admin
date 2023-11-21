import { useState, useEffect } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

export default function Switcher() {
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
    const [darkSide, setDarkSide] = useState(
        colorTheme === "light" ? true : false
    );

    const toggleDarkMode = (checked) => {
        setTheme(colorTheme);
        setDarkSide(checked);
    };

    return (
        <>
            <DarkModeSwitch
                style={{
                    margin: "auto 0",
                }}
                checked={darkSide}
                onChange={toggleDarkMode}
                size={30}
                sunColor="#1F2937"
            />
        </>
    );
}

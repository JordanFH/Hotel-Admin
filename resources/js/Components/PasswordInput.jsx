import React, { useState } from 'react';
import { Password } from "primereact/password";

function PasswordInput(props) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Password
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            toggleMask
            feedback={false}
            autoComplete="current-password"
            className='mt-1 block w-full'
            inputStyle={{
                width: "100%",
                height: "42px",
                padding: ".5rem .75rem",
                fontSize: "1rem",
                fontWeight: "400",
                lineHeight: "1.5",
                color: "#495057",
                backgroundColor: "#fff",
                backgroundClip: "padding-box",
                border: `solid ${isFocused ? "2px #6366f1" : "1px #ced4da"}`, // Cambia 'blue' al color que desees
                borderRadius: "0.375rem",
                boxShadow: "none",
            }}
        />
    );
}

export default PasswordInput;

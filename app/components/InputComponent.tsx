import React from 'react';

const InputComponent = (props: {name: string, placeholder: string, query: string | undefined, value: string | number, onChange: React.ChangeEventHandler<HTMLInputElement>}) => {
    return (
        <>
            <input
                name={props.name}
                defaultValue={props.query}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                className="bg-gray-300 text-black rounded-md w-full"
            />
        </>
    )
}

export default InputComponent;
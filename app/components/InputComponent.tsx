import React from 'react';

const InputComponent = (props: {name: string, placeholder: string, query: string | undefined, value: any, onChange: any}) => {
    return (
        <>
            <input
                name={props.name}
                defaultValue={props.query}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                className="bg-gray-300 text-black rounded-md"
            />
        </>
    )
}

export default InputComponent;
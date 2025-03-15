'use client'

import Link from "next/link";
import Image from "next/image";

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;

        if(form) form.reset();
        console.log(form);
    }

    return (
        <button className="text-white" type="reset" onClick={reset}>
            <Link href="/">
                <Image src="/x.png" alt="close" width={25} height={25}></Image>
            </Link>
        </button>
    )
}

export default SearchFormReset;
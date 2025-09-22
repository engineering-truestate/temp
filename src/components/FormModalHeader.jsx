import React from 'react'

function FormModalHeader({ headerTitle, headerCount=0, subTitle = null, onClose }) {
    return (
        <div className="sticky top-0 bg-white z-50 w-full flex justify-between items-center p-4 border-b">
            <div className="flex-col">
                <div className="mr-5 font-montserrat font-semibold text-xl text-black items-center">
                    {headerTitle} {headerCount > 0 && <span>({headerCount})</span>}
                </div>
                {subTitle &&
                    <div className="text-[14px] text-[#464748]">{subTitle}</div>
                }
            </div>
            <button className="text-2xl text-gray-600 hover:text-red-500 cursor-pointer" onClick={onClose}>&times;</button>
        </div>  
    )
}

export default FormModalHeader
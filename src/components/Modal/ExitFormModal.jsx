import React from 'react'
import tick from "/images/check-circle.png";
import dangerIcon from "../../../public/images/danger.png";
import CloseIcon from "/assets/icons/navigation/btn-close-alt.svg";



function ExitFormModal({handleOnCloseModal, closeModal}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-[#FAFAFA]  w-full max-w-[344px] md:w-[344px] ml-4 mr-4 h-auto p-[16px] px-[24px] rounded-lg border border-transparent">
      <div className="flex flex-col justify-between mb-6">
        <div className='flex flex-row justify-between'>
        <img
          src={dangerIcon}
          className="w-[24px] h-[24px] p-[2px] mb-3"
          alt="warner"
        />        

        <img
          src={CloseIcon}
          onClick={()=>closeModal(false)}
          className="w-[24px] h-[16px] p-[2px] mb-3 cursor-pointer"
          alt="warner"
        />
        </div>

        <h2 className="font-montserrat font-bold text-[16px] leading-[24px] tracking-[0.25px] mb-[6px]">
          Are you sure to exit the form?
        </h2>
        <p className="font-lato text-[14px] leading-[21px] text-[#433F3E] font-medium">
          {/* After deleting the form you will not be able to recover it. */}
          You will loss all the data entered in this form.
        </p>
      </div>
      <button
        className=" w-full h-[37px] px-[24px] py-[8px] font-lato font-semibold text-[14px] leading-[21px] bg-[#153E3B] text-white rounded-md"
        onClick={()=>handleOnCloseModal()}
      >
        Back to Find Projects
      </button>
    </div>
  </div>
  )
}

export default ExitFormModal

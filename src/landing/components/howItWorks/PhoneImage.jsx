const PhoneImage = ({ image }) => {
  return (
    <div className="w-full h-full flex justify-end items-center px-4 md:px-6">
      <img src={image} alt="Phone Screen" className=" !md:w-[33rem]" />
    </div>
  );
};

export default PhoneImage;

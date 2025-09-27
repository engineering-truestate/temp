import { useSelector } from "react-redux";
import { selectLoader } from "../slices/loaderSlice";
import trueStateIcon from "../../public/assets/icons/ui/truestateIcon.svg";

const Loader = () => {
  const loading = useSelector(selectLoader);
  if (!loading) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="animate-spin rounded-full h-full w-full border-4 border-green-900 border-t-transparent border-l-transparent"></div>
          <img
            src={trueStateIcon}
            alt="Logo"
            className="absolute inset-0 m-auto h-8 w-8"
          />
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};


export default Loader;

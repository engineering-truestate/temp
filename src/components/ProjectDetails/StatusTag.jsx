import { Flag, Check } from "lucide-react";
import check from "/assets/icons/status/success.svg";
import redflag from "/images/danger.png";
import clear from "/assets/icons/status/warning.svg";

export default function StatusTag({ label, status }) {
  let bg = "bg-white";
  let border = "border border-gray-400"; // 1px solid default
  let text = "font-lato text-[14px] font-semibold";
  if (!status) {
  text += " text-gray-400";  // Apply grey color
} else {
  text += " text-black";  // Default color
}
  let icon = <img className="w-[18px] h-[18px]" src={clear} alt="default icon" />;

  if (status === "issue") {
    bg = "bg-red-100";
    border = "border border-red-700";
    icon = <img className="w-[18px] h-[18px]" src={redflag} alt="issue icon" />;
  } else if (status === "clear") {
    bg = "bg-green-100";
    border = "border border-green-700";
    icon = <img className="w-[18px] h-[18px]" src={check} alt="check icon" />;
  }

  return (
    <div className={`flex items-center gap-1 px-[6px] py-[4px]3 h-[29px] w-fit rounded-[4px] ${bg} ${border}`}>
      {icon}
      <span className={text}>{label}</span>
    </div>
  );
}

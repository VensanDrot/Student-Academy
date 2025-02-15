import React, { useEffect, SetStateAction } from "react";
import { ReactComponent as Check } from "../img/check.svg";
import { ReactComponent as Cross } from "../img/plus.svg";

interface IProps {
  header: string;
  line: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  autoCloseTime?: number; // Time in milliseconds for auto-close
  error?: boolean;
}

const Toaster: React.FC<IProps> = ({ header, line, isOpen, setIsOpen, autoCloseTime = 4500, error = false }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, autoCloseTime);

      // Cleanup the timer when the component unmounts or isOpen changes
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseTime, setIsOpen]);

  return (
    <div
      className={`w-[400px] h-fit z-[100000000] p-4 rounded-lg bg-white duration-[350ms] items-center flex gap-2 absolute -top-4 right-4 ${
        !isOpen && "right-[-150%]"
      }`}
    >
      <div className="w-fit">
        <div className={`w-5 rounded-full h-5 flex justify-center items-center ${error ? "bg-redinput" : "bg-done"}`}>
          {error ? <Cross className="fill-white rotate-45" /> : <Check className="fill-white" />}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-st text-textblack">{header}</h1>
        {line && <p className="font-normal text-ft text-textlightgrey">{line}</p>}
      </div>
      <button type="button" className="h-fit right-0 ml-auto" onClick={() => setIsOpen(false)}>
        <Cross className="fill-icongray rotate-45" />
      </button>
    </div>
  );
};

export default Toaster;

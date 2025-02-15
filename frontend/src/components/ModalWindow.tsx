import React from "react";
import { ReactComponent as ExitB } from "../img/plus.svg";

interface IProps {
  active: boolean;
  headerText: string;
  onClick: () => void;
  children: React.ReactNode;
  childrenForLabel?: React.ReactNode;
  className?: string;
  labelClass?: string;
}

const ModalWindow: React.FC<IProps> = ({
  headerText,
  active,
  children,
  childrenForLabel,
  className,
  labelClass,
  onClick,
}) => {
  return (
    <>
      <div
        className={`w-full h-screen -top-[81px] absolute duration-300 inset-0 z-[10000] m-auto bg-modalbg ${
          !active && "right-[-200%]"
        }`}
      >
        <div
          className={`bg-white rounded-2xl px-8 py-6 h-fit min-w-[400px] w-fit flex flex-col gap-6 absolute inset-0 m-auto duration-300 ${
            !active && "left-[-400%] right-0"
          } ${className}`}
        >
          <div className="flex justify-between items-center gap-2">
            <div className={`flex flex-col gap-2 ${labelClass}`}>
              <h1 className="text-st font-semibold text-textblack">{headerText}</h1>
              {childrenForLabel}
            </div>
            <button type="button" className="flex justify-center items-center" onClick={onClick}>
              <ExitB className="fill-textblack rotate-45" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default ModalWindow;

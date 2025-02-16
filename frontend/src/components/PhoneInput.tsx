import React from "react";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";

interface IProps {
  value: string;
  onChange: (e: string) => void;
  error?: string;
  className?: string;
}

const PhoneInputComp: React.FC<IProps> = ({ value, error, className, onChange }) => {
  return (
    <div>
      <PhoneInput
        defaultCountry="uz"
        className={`flex gap-2.5 w-full [&>ul]:!outline-none [&>input]:!w-full [&>input]:!h-[42px] [&>input]:!rounded-lg [&>input]:!text-ft [&>div>button]:!pl-2 [&>div>button]:!pr-1.5 [&>div>button]:!rounded-lg [&>div>button]:!h-[42px] ${className} ${
          error && "[&>input]:!border-redinput [&>div>button]:border-red-500"
        }`}
        forceDialCode={true}
        value={value}
        onChange={onChange}
      />
      {error && (
        <div className="g-outer-additional-content">
          <div className="g-outer-additional-content__error" id="g-:r5:" data-qa="control-error-message-qa">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneInputComp;

import React from "react";
import { Button, TextInput } from "@gravity-ui/uikit";
import { ReactComponent as Zoom } from "../img/zoom.svg";
import { ReactComponent as Plus } from "../img/plus.svg";

interface IProps {
  id: string;
  placeholder: string;
  button: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
}

const TopPageSearch: React.FC<IProps> = ({ id, placeholder, button, value, onButtonClick, onChange }) => {
  return (
    <div className="w-full p-4 bg-white rounded-3xl flex gap-4">
      <TextInput
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        size="l"
        rightContent={<Zoom className="fill-icongray mr-3" />}
        hasClear
      />
      {onButtonClick && (
        <Button
          view="action"
          type="button"
          className="[&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:gap-1 [&>span]:text-tr"
          size="l"
          onClick={onButtonClick}
        >
          <Plus className="fill-black" />
          {button}
        </Button>
      )}
    </div>
  );
};

export default TopPageSearch;

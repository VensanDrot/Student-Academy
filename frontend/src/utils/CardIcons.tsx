import { ReactComponent as Humo } from "../img/Humo.svg";
import { ReactComponent as Visa } from "../img/visa.svg";
import { ReactComponent as UzCard } from "../img/Uzcard.svg";
import { ReactComponent as MasterCard } from "../img/mastercard.svg";
import { ReactComponent as Jowi } from "../img/jowi.svg";

export const CardIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case "humo": {
      return <Humo className={`mr-1 ${className}`} />;
    }
    case "uzcard": {
      return <UzCard className={`mr-1 ${className}`} />;
    }

    case "master": {
      return <MasterCard className={`mr-1 ${className}`} />;
    }
    case "visa": {
      return <Visa className={`mr-1 ${className}`} />;
    }
    default: {
      return <Jowi className={`mr-1 ${className}`} />;
    }
  }
};

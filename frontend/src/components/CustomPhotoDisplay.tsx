import { ReactComponent as TrashIcon } from "../img/bin.svg";
import { GetCorrectedLinkImg } from "../utils/getCorrectedLink";

const CustomPhotoDisplay = ({ src, alt, onDelete }: { src: string; alt: string; onDelete: () => void }) => {
  return (
    <div className="relative w-[212px] h-full rounded-xl overflow-hidden bg-gray-200 group">
      {/* Video */}
      <img
        src={src?.includes("blob") ? src : GetCorrectedLinkImg(src)}
        className="w-full h-full object-cover rounded-xl"
        alt={alt}
      />

      {/* Delete Button */}
      <div
        onClick={onDelete}
        className="absolute top-2 right-2 bg-[#FFFFFF33] bg-opacity-70 rounded-lg p-2 cursor-pointer"
      >
        <TrashIcon className="w-6 h-6 fill-white" />
      </div>
    </div>
  );
};

export default CustomPhotoDisplay;

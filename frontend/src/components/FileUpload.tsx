import React, { useEffect, useCallback, useState, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { ReactComponent as Image } from "../img/image.svg";
import { ReactComponent as Plus } from "../img/plus.svg";
import { ReactComponent as ToRight } from "../img/toright.svg";
import { ReactComponent as Notice } from "../img/notice.svg";
import CustomVideoPlayer from "./CustomVideoPlayer";
import { Button } from "@gravity-ui/uikit";
import { useTranslation } from "react-i18next";
import CustomPhotoDisplay from "./CustomPhotoDisplay";

export interface UploadedFile {
  id?: string | number;
  path: string;
  preview: string;
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type:
    | "image/png"
    | "image/jpeg"
    | "image/jpg"
    | "image/heic"
    | "video/mp4"
    | "video/mov"
    | "video/avi"
    | "video/webm";
  webkitRelativePath?: string;
}

interface IProps {
  setFiles?: (files: UploadedFile[]) => void;
  setArray?: React.Dispatch<SetStateAction<UploadedFile[]>>;
  files?: UploadedFile[];
  textEmpty?: string;
  error?: string;
  delFunction?: (item: any) => void;
}

export const FileUpload: React.FC<IProps> = ({ setFiles, setArray, delFunction, files, textEmpty, error }) => {
  const { t } = useTranslation();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [tempArray, setTempArray] = useState<UploadedFile[]>(files || []);

  useEffect(() => {
    if (files) {
      setTempArray(files);
    }
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      const newFiles = acceptedFiles?.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file), // Generate preview for each file
        })
      );
      setTempArray((prev) => [...prev, ...newFiles]);
      setArray && setArray([...tempArray, ...newFiles]);
      setFiles && setFiles([...tempArray, ...newFiles]);
    },
    [setFiles, setArray, tempArray]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/heic": [".heic"],
      "video/mp4": [".mp4"],
      "video/mov": [".mov"],
      "video/avi": [".avi"],
      "video/webm": [".webm"],
    },
  });

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 212; // Adjust scrolling distance
      container.scrollBy({ left: direction === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
    }
  };

  const deleteFunction = (file: any, index: number) => {
    delFunction && delFunction(file || "");
    setTempArray((oldValues) => {
      return oldValues.filter((_, i) => i !== index);
    });
    setArray && setArray(tempArray.filter((_, i) => i !== index));
    setFiles && setFiles(tempArray.filter((_, i) => i !== index));
  };

  const displayTwo = () => {
    return (
      <>
        {tempArray.length < 1 ? (
          <div
            {...getRootProps()}
            className={`flex justify-center items-center w-full h-[140px] text-modalbg border-dashed border-modalbg border rounded-3xl text-tr font-normal gap-2 ${
              error && "!border-[#e9033a] !text-[#e9033a]"
            }`}
          >
            <input {...getInputProps()} multiple />
            <Image className={`fill-modalbg ${error && "!fill-[#e9033a]"}`} />
            {textEmpty}
          </div>
        ) : (
          <div
            {...getRootProps()}
            ref={scrollContainerRef}
            className={`flex items-center overflow-hidden w-full h-[140px] text-modalbg border-modalbg rounded-xl text-tr font-normal gap-2 ${
              error && "!border-[#e9033a] !text-[#e9033a]"
            }`}
          >
            <input {...getInputProps()} multiple />

            {tempArray?.map((file, index) => {
              if (file?.type?.includes("video"))
                return (
                  <div
                    className="flex gap-4 items-center w-[212px] h-full relative"
                    key={`${index} ${file?.name} ${file?.id} ${file?.path}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CustomVideoPlayer src={file.preview} onDelete={() => deleteFunction(file, index)} />
                  </div>
                );
              return (
                <div
                  className="flex gap-4 items-center w-[212px] h-full relative"
                  key={`${index} ${file?.name} ${file?.id} ${file?.path}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CustomPhotoDisplay src={file.preview} onDelete={() => deleteFunction(file, index)} alt={file.name} />
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="w-full h-full flex flex-col gap-3 mb-2">{displayTwo()}</div>
      {error && <p className="text-tr font-normal text-[#e9033a] -mt-3">{error}</p>}
      <div className="flex justify-between">
        <Button
          view="normal"
          size="l"
          className="[&>span]:flex [&>span]:gap-3 [&>span]:items-center [&>span]:text-textblack"
          {...getRootProps()}
        >
          {t("file_upload.add")}
          <Plus className="fill-textblack" />
        </Button>

        <div className="flex gap-2">
          <Button view="normal" size="l" className="items-center" onClick={() => scroll("left")}>
            <ToRight className="fill-textblack rotate-180" />
          </Button>

          <Button view="normal" size="l" className="items-center" onClick={() => scroll("right")}>
            <ToRight className="fill-textblack" />
          </Button>
        </div>
      </div>

      <p className="flex gap-1 text-icongray items-center">
        <Notice className="fill-icongray" /> {t("file_upload.format")}
      </p>
    </div>
  );
};

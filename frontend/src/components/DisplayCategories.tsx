import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";
import { getNumberedCategories } from "../hooks/fetching/getNumCategories";

interface IProps {
  setActive: React.Dispatch<SetStateAction<string>>;
  active: string;
  isActiveJob?: boolean;
}

const DisplayCategories: React.FC<IProps> = ({ setActive, active, isActiveJob }) => {
  const { data: categories } = useQuery({
    queryKey: ["categories", isActiveJob],
    queryFn: () => getNumberedCategories(),
    staleTime: Infinity,
    retry: 2,
  });

  return (
    <div className="flex gap-2 container_x w-full overflow-x-auto whitespace-nowrap">
      <button
        type="button"
        onClick={() => setActive("")}
        className={`p-3 rounded-xl bg-white ${active === "" && "border border-iconorange"}`}
      >
        <p
          className={`text-st flex items-center gap-2 font-normal text-icongray ${active === "" && "!text-textblack"}`}
        >
          Все <span className="text-modalbg">{categories?.total_count}</span>
        </p>
      </button>

      {categories?.jobs?.map((job, index) => (
        <button
          type="button"
          key={`${job?.name}${index}`}
          onClick={() => setActive(job?.id?.toString())}
          className={`p-3 rounded-xl bg-white ${active === job?.id?.toString() && "border border-iconorange w-fit"}`}
        >
          <p
            className={`text-st flex items-center whitespace-nowrap gap-2 font-normal w-fit text-icongray ${
              active === job?.id?.toString() && "!text-textblack"
            }`}
          >
            {job?.name} <span className="text-modalbg w-fit">{job?.count}</span>
          </p>
        </button>
      ))}
    </div>
  );
};

export default DisplayCategories;

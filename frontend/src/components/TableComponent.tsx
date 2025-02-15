import React from "react";
import { Loader, Pagination, PaginationProps } from "@gravity-ui/uikit";
import { RenderRowActionsProps, Table, withTableActions } from "@gravity-ui/uikit";
import { useTranslation } from "react-i18next";

interface IProps {
  data: { [key: string]: any }[];
  columns: { id: string; name: string; template?: (item: any) => React.ReactNode }[];
  className?: string;
  classNameDiv?: string;
  page: number;
  totalPages: number;
  perPage: number;
  isLoading: boolean;
  topChild?: React.ReactNode;
  rowActionRender?: ({ item }: RenderRowActionsProps<any>) => React.ReactNode;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
}

const TableComponent: React.FC<IProps> = ({
  data,
  columns,
  className,
  classNameDiv,
  page,
  totalPages,
  perPage,
  isLoading,
  topChild,
  rowActionRender,
  setPage,
  setPerPage,
}) => {
  const MyTable = withTableActions(Table);
  const { t } = useTranslation();

  const enhancedColumns = columns.map((column) => ({
    ...column,
    template: column.template || ((item: any) => <span>{item[column.id]}</span>),
  }));

  const handleUpdate: PaginationProps["onUpdate"] = (page: number, pageSize: number) => {
    setPage(page);
    setPerPage(pageSize);
  };

  return (
    <div className="flex flex-grow bg-white rounded-3xl">
      <div className={`w-full p-4 flex-col bg-white rounded-3xl flex  ${classNameDiv}`}>
        {!isLoading ? (
          <>
            {topChild}
            <MyTable
              data={data}
              columns={enhancedColumns}
              className={`w-full h-full scroll-cont [&>table]:!w-full [&>table]:!h-max [&>table>thead]:sticky [&>table>thead]:top-0 [&>table>thead]:bg-white [&>table>thead]:z-10 ${className}`}
              renderRowActions={(rowActionRender as any) || undefined}
              emptyMessage={t("no_data")}
            />

            <hr className="mb-3" />

            <Pagination
              className="self-end bottom-0 mt-auto"
              compact={false}
              showInput
              page={page}
              pageSize={perPage}
              pageSizeOptions={[10, 20, 30]}
              total={totalPages}
              onUpdate={handleUpdate}
            />
          </>
        ) : (
          <div className="h-full w-full flex justify-center items-center">
            <Loader size="l" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableComponent;

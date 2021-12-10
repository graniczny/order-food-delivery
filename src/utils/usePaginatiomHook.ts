import { useEffect, useState } from "react";

interface ReturnObject<T> {
  currentPage: number;
  paginatedData: PaginatedData<T>;
  nextPage: () => void;
  previousPage: () => void;
  nextPageButtonDisabled: boolean;
  previousPageButtonDisabled: boolean;
}

interface PaginatedData<T> {
  [pageNumber: number]: T[];
}

const basePageSize = 10;

export default function usePaginationHook<T>(
  entryData: T[],
  customPageSize?: number
): ReturnObject<T> {
  const pageSize = customPageSize || basePageSize;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [paginatedData, setPaginatedData] = useState<PaginatedData<T>>([]);
  const [nextPageButtonDisabled, setNextPageButtonDisabled] = useState<boolean>(true);
  const [previousPageButtonDisabled, setPreviousPageButtonDisabled] =
    useState<boolean>(true);

  useEffect(() => {
    if (entryData.length) {
      const pagesCount = Math.ceil(entryData.length / pageSize);
      const translatedObj: PaginatedData<T> = { 0: [] };

      for (let i = 0; i < pagesCount; i += 1) {
        const array = [...entryData].splice(i * pageSize, pageSize);
        translatedObj[i] = array;
      }

      setCurrentPage(0);
      setPaginatedData(translatedObj);
    } else {
      setCurrentPage(0);
      setPaginatedData([]);
    }
  }, [entryData, pageSize]);

  useEffect(() => {
    if (paginatedData) {
      const pages = Object.keys(paginatedData);
      if (Number(pages[pages.length - 1]) === currentPage) {
        setNextPageButtonDisabled(true);
      } else {
        setNextPageButtonDisabled(false);
      }

      if (currentPage === 0) {
        setPreviousPageButtonDisabled(true);
      } else {
        setPreviousPageButtonDisabled(false);
      }
    }
  }, [currentPage, paginatedData]);

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (paginatedData?.[currentPage]?.[pageSize - 1]) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    currentPage,
    paginatedData,
    nextPage,
    previousPage,
    nextPageButtonDisabled,
    previousPageButtonDisabled,
  };
}

import { create } from "zustand";

export type Search = {
  search: string;
};

interface SearchLayout {
  setSearch: (search: string) => void;
  setPageNumber: (pageNumber: number) => void;
  setNumberPages: (numberPages: number) => void;
  setPageLimit: (pageLimit: number) => void;
  modifyFilter: (chosenFilter: string) => void;
  removeFilter: () => void;
  modifySort: (chosenSort: string) => void;
  removeSort: () => void;
  setQueryKey: (queryKey: string) => void;
  setInclude: (include: string) => void;

  search: string;
  numberPages: number;
  pageNumber: number;
  pageLimit: number;
  filter: string;
  sort: string;
  queryKey: string;
  include: string;
  params?: any;
}

export const useSearchStore = create<SearchLayout>((set) => ({
  // setSearch is a function to set the search
  setInclude(include: string) {
    set((state) => ({ ...state, include: include }));
  },
  setSearch: (search: string) => {
    set((state) => ({ ...state, search: search }));
  },

  setPageNumber: (pageNumber: number) => {
    set((state) => ({ ...state, pageNumber: pageNumber }));
  },

  setPageLimit: (pageLimit: number) => {
    set((state) => ({ ...state, pageLimit: pageLimit }));
  },

  setNumberPages: (numberPages: number) => {
    set((state) => ({ ...state, numberPages: numberPages }));
  },

  modifyFilter: (chosenFilter: string) => {
    set((state) => ({ ...state, filter: chosenFilter }));
  },
  removeFilter: () => {
    set((state) => ({ ...state, filter: "" }));
  },

  modifySort: (chosenSort: string) => {
    set((state) => ({ ...state, sort: chosenSort }));
  },
  removeSort: () => {
    set((state) => ({ ...state, sort: "" }));
  },
  setQueryKey: (queryKey: string) => {
    set((state) => ({ ...state, queryKey: queryKey }));
  },

  include: "",
  search: "",
  numberPages: 0,
  pageNumber: 1,
  pageLimit: 10,
  filter: "",
  sort: "",
  queryKey: "",
}));

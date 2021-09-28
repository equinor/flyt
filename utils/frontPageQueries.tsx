import { useQuery } from "react-query";
import { getProjects } from "services/projectApi";

const getProjectsIndex = (
  page: number,
  orderBy: string,
  itemsPerPage: number
) => {
  const { data, isLoading, error } = useQuery(["projects", page, orderBy], () =>
    getProjects({
      page,
      items: itemsPerPage,
      orderBy: orderBy.toString(),
    })
  );
  return { data, isLoading, error };
};

const getProjectsMine = (
  page: number,
  orderBy: string,
  itemsPerPage: number,
  userNameFilter
) => {
  const { data, isLoading, error } = useQuery(
    ["myProjects", page, userNameFilter, orderBy],
    () =>
      getProjects({
        page,
        user: userNameFilter,
        items: itemsPerPage,
        orderBy: orderBy.toString(),
      })
  );
  return { data, isLoading, error };
};

const getProjectsFavourite = (
  page: number,
  orderBy: string,
  itemsPerPage: number
) => {
  const { data, isLoading, error } = useQuery(
    ["favProjects", page, "isFavourite", orderBy],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        onlyFavorites: true,
        orderBy: orderBy.toString(),
      })
  );
  return { data, isLoading, error };
};

const getProjectsSearch = (
  page: number,
  orderBy: string,
  itemsPerPage: number,
  queryString: string
) => {
  const { data, isLoading, error } = useQuery(
    ["searchedProjects", page, queryString, orderBy],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        q: queryString,
        orderBy: orderBy.toString(),
      })
  );
  return { data, isLoading, error };
};

export const doFrontPageQuery = (
  pageType: string,
  page,
  orderBy,
  itemsPerPage,
  queryString?: string,
  userNameFilter?: string
) => {
  if (pageType == "index") {
    return getProjectsIndex(page, orderBy, itemsPerPage);
  } else if (pageType == "mine") {
    return getProjectsMine(page, orderBy, itemsPerPage, userNameFilter);
  } else if (pageType == "favourite") {
    return getProjectsFavourite(page, orderBy, itemsPerPage);
  } else {
    return getProjectsSearch(page, orderBy, itemsPerPage, queryString);
  }
};

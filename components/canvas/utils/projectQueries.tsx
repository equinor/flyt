import { getProjects } from "@/services/projectApi";
import { Project } from "@/types/Project";
import { stringToArray } from "@/utils/stringHelpers";
import router from "next/router";
import { useInfiniteQuery } from "react-query";

type Page = {
  projects: Project[];
  totalItems: number;
};

const getNextPageParam = (
  lastPage: Page,
  allPages: Page[],
  itemsPerPage: number
) => {
  const hasMorePages = lastPage.projects.length === itemsPerPage;
  return !hasMorePages ? undefined : allPages.length + 1;
};

export const getQueryAllProcesses = (itemsPerPage: number) =>
  useInfiniteQuery(
    [
      "projects",
      itemsPerPage,
      router.query.q,
      router.query.user,
      router.query.rl,
      router.query.orderBy,
    ],
    ({ pageParam = 1 }) =>
      getProjects({
        page: pageParam,
        items: itemsPerPage,
        q: stringToArray(router.query.q),
        ru: stringToArray(router.query.user),
        rl: stringToArray(router.query.rl),
        orderBy: `${router.query.orderBy}`,
      }),
    {
      getNextPageParam: (lastPage, allPages) =>
        getNextPageParam(lastPage, allPages, itemsPerPage),
    }
  );

export const getQueryMyProcesses = (
  itemsPerPage: number,
  myUserId: number | undefined,
  requiredUsers: string[]
) =>
  useInfiniteQuery(
    [
      "myProjects",
      myUserId,
      itemsPerPage,
      router.query.q,
      requiredUsers,
      router.query.rl,
      router.query.orderBy,
    ],
    ({ pageParam = 1 }) =>
      getProjects({
        page: pageParam,
        items: itemsPerPage,
        q: stringToArray(router.query.q),
        ru: myUserId ? [...requiredUsers, myUserId] : requiredUsers,
        rl: stringToArray(router.query.rl),
        orderBy: `${router.query.orderBy}`,
      }),
    {
      getNextPageParam: (lastPage, allPages) =>
        getNextPageParam(lastPage, allPages, itemsPerPage),
      enabled: !!myUserId,
    }
  );

export const getQueryFavProcesses = (itemsPerPage: number) =>
  useInfiniteQuery(
    [
      "favProjects",
      itemsPerPage,
      "isFavourite",
      router.query.q,
      router.query.user,
      router.query.rl,
      router.query.orderBy,
    ],
    ({ pageParam = 1 }) =>
      getProjects({
        page: pageParam,
        items: itemsPerPage,
        onlyFavorites: true,
        q: stringToArray(router.query.q),
        ru: stringToArray(router.query.user),
        rl: stringToArray(router.query.rl),
        orderBy: `${router.query.orderBy}`,
      }),
    {
      getNextPageParam: (lastPage, allPages) =>
        getNextPageParam(lastPage, allPages, itemsPerPage),
    }
  );

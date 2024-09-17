import { getProjects } from "@/services/projectApi";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInfiniteQuery } from "react-query";
import { stringToArray } from "utils/stringToArray";

export const useProcessesQuery = () => {
  const itemsPerPage = 35;
  const router = useRouter();
  const query = useInfiniteQuery(
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
      getNextPageParam: (lastPage, allPages) => {
        const hasMorePages = lastPage.projects.length === itemsPerPage;
        if (!hasMorePages) return undefined;
        return allPages.length + 1;
      },
    }
  );

  useEffect(() => {
    const onScroll = () => {
      if (
        query.hasNextPage &&
        !query.isFetchingNextPage &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 128
      ) {
        void query.fetchNextPage();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [query.hasNextPage, query.isFetchingNextPage]);

  return { query };
};

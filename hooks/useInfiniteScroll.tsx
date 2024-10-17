import { InfiniteQueryProjects } from "@/types/InfiniteQueryProjects";
import { useEffect, useRef } from "react";

export const useInfiniteScroll = (query: InfiniteQueryProjects) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const getIsBottomReached = () => {
    if (scrollContainerRef.current) {
      return (
        scrollContainerRef.current.scrollTop ===
        scrollContainerRef.current.scrollHeight -
          scrollContainerRef.current.clientHeight
      );
    } else {
      return (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 128
      );
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const bottomReached = getIsBottomReached();
      if (query.hasNextPage && !query.isFetchingNextPage && bottomReached) {
        void query.fetchNextPage();
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef?.current?.addEventListener("scroll", onScroll);
      return () =>
        scrollContainerRef?.current?.removeEventListener("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [query.hasNextPage, query.isFetchingNextPage, scrollContainerRef.current]);

  return { scrollContainerRef };
};

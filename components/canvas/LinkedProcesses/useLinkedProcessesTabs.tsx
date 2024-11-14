import { useRouter } from "next/router";
import { useEffect } from "react";

export const useLinkedProcessesTabs = () => {
  const { query, pathname, push } = useRouter();
  const { id, tab, showNewConnection } = query;

  const showNewConnectionForm = showNewConnection === "true";
  const activeTab = Number(tab) || 0;

  const handleChangeTab = (index: number) => {
    if (index === 2) {
      push({
        pathname,
        query: { ...query, showNewConnection: "true" },
      });
    } else {
      push({
        pathname,
        query: { ...query, tab: index.toString() },
      });
    }
  };

  const onConnectProcessClick = () => {
    push({
      pathname,
      query: { ...query, showNewConnection: "true" },
    });
  };

  const onConnectProcessClose = () => {
    push({
      pathname,
      query: { id, tab, showNewConnection: "false" },
    });
  };

  useEffect(() => {
    if (!tab || !showNewConnection) {
      push({
        pathname,
        query: { ...query, tab: "0", showNewConnection: "false" },
      });
    }
  }, []);

  return {
    showNewConnectionForm,
    onConnectProcessClick,
    onConnectProcessClose,
    activeTab,
    handleChangeTab,
  };
};

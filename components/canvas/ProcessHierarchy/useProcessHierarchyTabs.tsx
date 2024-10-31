import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useProcessHierarchyTabs = () => {
  const { query, pathname, push } = useRouter();

  const [activeTab, setActiveTab] = useState(Number(query.tab) || 0);
  const [showNewConnectionForm, setShowNewConnectionForm] = useState(
    query.showNewConnection === "true"
  );

  const handleChangeTab = (index: number) => {
    if (index === 2) {
      push({
        pathname,
        query: { ...query, showNewConnection: "true" },
      });
    } else {
      setActiveTab(index);
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
      query: { ...query, showNewConnection: "false" },
    });
  };

  useEffect(() => {
    setActiveTab(Number(query.tab) || 0);
  }, [query.tab]);

  useEffect(() => {
    setShowNewConnectionForm(query.showNewConnection === "true");
  }, [query.showNewConnection]);

  useEffect(() => {
    if (!query.tab || !query.showNewConnection) {
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

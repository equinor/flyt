import { useAccount, useMsal } from "@azure/msal-react";
import { Pagination, Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doFrontPageQuery } from "utils/frontPageQueries";
import { getUserShortName } from "utils/getUserShortName";
import styles from "./FrontPageBody.module.scss";
import { ProjectListSection } from "./ProjectListSection";

export default function FrontPageBody(props: {
  pageType: string;
  queryString?: string;
}): JSX.Element {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { orderBy } = router.query;

  const { accounts } = useMsal();
  const account = useAccount(accounts[0]);
  const userNameFilter = getUserShortName(account);

  const itemsPerPage =
    props.pageType == "index" || props.pageType == "mine" ? 15 : 16;
  const showNewProjectButton =
    props.pageType == "index" || props.pageType == "mine" ? true : false;

  const { data, isLoading, error } = doFrontPageQuery(
    props.pageType,
    page,
    orderBy,
    itemsPerPage,
    props.queryString,
    userNameFilter
  );

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data?.totalItems) setTotalItems(data.totalItems);
  }, [data?.totalItems]);

  if (error)
    return (
      <div className={styles.frontPageBody}>
        <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
        <Typography variant={"h3"}>{error.toString()}</Typography>
      </div>
    );

  return (
    <div className={styles.frontPageBody}>
      <ProjectListSection
        projects={data?.projects}
        isLoading={isLoading}
        expectedNumberOfProjects={itemsPerPage}
        showNewProjectButton={showNewProjectButton}
      />
      <div className={styles.frontPageFooter}>
        {console.log(totalItems)}
        {itemsPerPage < totalItems && (
          <Pagination
            key={`${totalItems}`}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            // withItemIndicator
            defaultValue={page}
            onChange={(event, newPage) => setPage(newPage)}
          />
        )}
      </div>
    </div>
  );
}

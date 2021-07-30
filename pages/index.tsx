import React, { useEffect, useState } from "react";
import commonStyles from "../styles/common.module.scss";
import Head from "next/head";
import { Pagination, Switch, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../layouts/LayoutWrapper";
import { ProjectListSection } from "../components/projectListSection";
import { useQuery } from "react-query";
import { getProjects } from "../services/projectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { getUserShortName } from "../utils/getUserShortName";
import { checkIfCreatorOrEditor } from "../utils/categorizeProjects";

const itemsPerPage = 19;
export default function Projects(): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0]);
  const [showMyProjects, setShowMyProjects] = useState(true);
  const [page, setPage] = useState(1);
  const [userNameFilter, setUserNameFilter] = useState("");

  const { data, isLoading, error } = useQuery(
    ["projects", page, userNameFilter],
    () =>
      getProjects({
        page,
        user: userNameFilter,
        items: itemsPerPage,
      })
  );

  useEffect(() => {
    if (showMyProjects) setUserNameFilter(getUserShortName(account));
    else setUserNameFilter("");
    setPage(1);
  }, [showMyProjects]);
  const [lastTotalItems, setLastTotalItems] = useState(0);

  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data?.totalItems) setLastTotalItems(data.totalItems);
  }, [data?.totalItems]);

  if (error)
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Projects</title>
          <link rel="icon" href={"/favicon.ico"} />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
          <Typography variant={"h3"}>{error.toString()}</Typography>
        </main>
      </div>
    );

  const filteredProjects = userNameFilter
    ? data?.projects
    : data?.projects.filter((project) => {
        const { imCreator, imEditor } = checkIfCreatorOrEditor(
          project,
          account
        );
        return imCreator || imEditor || !!project.name;
      }); //Hide projects with no name that I don't have access to

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.main}>
        <div
          style={{
            marginBottom: 20,
            alignItems: "center",
            display: "flex",
            borderRadius: 4,
            padding: 12,
            width: "50%",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Switch
            size={"small"}
            label="Only show projects i can edit"
            checked={showMyProjects}
            onChange={() => {
              setShowMyProjects(!showMyProjects);
            }}
          />
          <Pagination
            key={showMyProjects.toString()}
            totalItems={data?.totalItems || lastTotalItems} // lastTotalItems-> Hack so that the pagination does not flicker
            itemsPerPage={itemsPerPage}
            // withItemIndicator
            defaultValue={page}
            onChange={(event, newPage) => setPage(newPage)}
          />
        </div>
        <ProjectListSection projects={filteredProjects} isLoading={isLoading} />
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;

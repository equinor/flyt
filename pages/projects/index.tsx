import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import Head from "next/head";
import { Pagination, Switch, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../../layouts/LayoutWrapper";
import { ProjectListSection } from "../../components/ProjectListSection";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { getUserShortName } from "../../utils/getUserShortName";
import { checkIfCreatorOrEditor } from "../../utils/categorizeProjects";
import SideNavBar from "components/SideNavBar";

const itemsPerPage = 100; // increased from 19 to 100 since filtering (hiding project without name) is done on the client side
// it looks bad when every other page just have a few cards and others have more... Therefore it would be better to just show a greater amount of cards at once

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

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data?.totalItems) setTotalItems(data.totalItems);
  }, [data?.totalItems]);

  if (error)
    return (
      <div className={commonStyles.frontPageContainer}>
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
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.main}>
        <SideNavBar />
        <div className={commonStyles.contentContainer}>
          <div
            style={{
              marginBottom: 20,
              alignItems: "center",
              display: "flex",
              borderRadius: 4,
              padding: 12,
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
            {itemsPerPage < totalItems && (
              <Pagination
                key={`${showMyProjects} ${totalItems}`}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                // withItemIndicator
                defaultValue={page}
                onChange={(event, newPage) => setPage(newPage)}
              />
            )}
          </div>
          <ProjectListSection
            projects={filteredProjects}
            isLoading={isLoading}
            expectedNumberOfProjects={itemsPerPage}
          />
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;

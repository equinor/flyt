import React, { useEffect, useState } from "react";
import commonStyles from "../../styles/common.module.scss";
import Head from "next/head";
import { Pagination, TextField, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../../layouts/LayoutWrapper";
import { ProjectListSection } from "../../components/ProjectListSection";
import { useQuery } from "react-query";
import { getProjects } from "../../services/projectApi";
import SideNavBar from "components/SideNavBar";
import { checkIfCreatorOrEditor } from "utils/categorizeProjects";
import { useAccount, useMsal } from "@azure/msal-react";
import { debounce } from "utils/debounce";

const itemsPerPage = 20; // increased from 19 to 100 since filtering (hiding project without name) is done on the client side
// it looks bad when every other page just have a few cards and others have more... Therefore it would be better to just show a greater amount of cards at once

export default function Projects(): JSX.Element {
  const { accounts } = useMsal();
  const account = useAccount(accounts[0]);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const { data, isLoading, error } = useQuery(["projects", page, q], () =>
    getProjects({
      page,
      items: itemsPerPage,
      q: q,
    })
  );

  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    //Hack so that the pagination does not flicker
    if (data?.totalItems) setTotalItems(data.totalItems);
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

  const filteredProjects = data?.projects.filter((project) => {
    const { imCreator, imEditor } = checkIfCreatorOrEditor(project, account);
    return imCreator || imEditor || !!project.name;
  }); //Hide projects with no name that I don't have access to

  return (
    <div className={commonStyles.container} style={{ padding: "0" }}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.frontPageMain}>
        <SideNavBar />
        <div className={commonStyles.contentContainer}>
          <div className={commonStyles.searchFieldContainer}>
            <input
              className={commonStyles.searchField}
              type="text"
              placeholder="Search content"
              onChange={(e) => {
                debounce(() => setQ(e.target.value), 500, "projectSearch");
              }}
            />
          </div>
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
          <ProjectListSection
            projects={filteredProjects}
            isLoading={isLoading}
            expectedNumberOfProjects={itemsPerPage}
            printNewProjectButton={false}
          />
        </div>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;

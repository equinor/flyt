import commonStyles from "../../../styles/common.module.scss";
import Head from "next/head";
import { Button, Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Layouts } from "../../../layouts/LayoutWrapper";
import { useQuery } from "react-query";
import { getProject } from "../../../services/projectApi";
import { unknownErrorToString } from "../../../utils/isError";
import { Loading } from "../../../components/loading";
import { ErrorMessage } from "../../../components/errorMessage";
import { vsmObject } from "../../../interfaces/VsmObject";
import { MainActivityContainer } from "../../../components/card";
import { VSMSideBar } from "../../../components/VSMSideBar";
import { defaultAnnouncements, DndContext } from "@dnd-kit/core";
import { useAccount, useMsal } from "@azure/msal-react";
import Link from "next/link";

function Process(props: {
  processId: string | string[];
  onClickCard: (card: vsmObject) => void;
}) {
  const { processId: id } = props;
  const {
    data: process,
    error,
    isLoading,
  } = useQuery(["project", id], () => getProject(id), {
    enabled: !!id,
  });

  // Store the sorting order of the cards, so we can reorder them when the user drags and drops them
  // Note, this is first done locally, without reloading the page, and then sent to the server
  const [order, setOrder] = React.useState([]);

  // Whenever we get an update from the server, we update the local state
  // That means that the server is the source of truth for the process, we just do our best effort to keep it in sync
  useEffect(() => {
    if (process) {
      setOrder(process.objects[0].childObjects.map((o) => o.vsmObjectID));
    }
  }, [process]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  if (!process) return <ErrorMessage error={"No process found"} />;
  return (
    <>
      <Head>
        <title>{process.name}</title>
      </Head>
      <div
        style={{
          paddingTop: 64,
          display: "flex",
        }}
      >
        <DndContext announcements={defaultAnnouncements}>
          {order.map((id) => {
            return (
              <MainActivityContainer
                key={id}
                child={process.objects[0]?.childObjects?.find(
                  (c) => c.vsmObjectID === id
                )}
                onClickCard={props.onClickCard}
                direction={"vertical"}
              />
            );
          })}
        </DndContext>
      </div>
    </>
  );
}

// Feel free to delete this component after reading it
function FriendlyMessage() {
  const router = useRouter();
  const { id } = router.query;

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  return (
    <div style={{ padding: 24 }}>
      <h1>Hello {account?.name.split(" ")[0]},</h1>
      <p>This is the new HTML DOM version of the Flyt process page.</p>
      <p>
        The layout is finished, but the code for moving the cards is not. This
        page illustrates how the drag-groupings should work. (Without sorting)
      </p>
      <p>
        I think that DNDKit should be flexible enough, though it will take some
        time getting it set up correct...
      </p>
      <Link href={`https://dndkit.com`}>
        <Button variant="contained">Read more about DND Kit here</Button>
      </Link>
      <p>
        I`ve started over again in
        <Link href={`/process/${id}/dndkit`}> /dndkit-page </Link>
        starting setting up the sorting interaction skeleton, but I`m far from
        finished it yet. So it`s up to you to decide if you want to use it or
        not or continue from this page.
        <br />
        <br />
        Godspeed!
        <br />- Henry
      </p>
    </div>
  );
}

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  const { data: project, error } = useQuery(
    ["project", id],
    () => getProject(id),
    {
      enabled: !!id,
    }
  );
  const [selectedCard, setSelectedCard] = React.useState<vsmObject | null>(
    null
  );

  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">{unknownErrorToString(error)}</Typography>
          <p>
            We have some troubles with this process. Please try to refresh the
            page.
          </p>
        </main>
      </div>
    );
  }
  return (
    <div>
      <Head>
        <title>{project?.name || `Flyt | Process ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <FriendlyMessage />
        <VSMSideBar
          onClose={() => setSelectedCard(null)}
          onDelete={function (): void {
            throw new Error("Function not implemented.");
          }}
          canEdit={false}
          selectedObject={selectedCard}
        />
        <Process processId={id} onClickCard={setSelectedCard} />
      </main>
    </div>
  );
}

Project.layout = Layouts.Empty;
Project.auth = true;

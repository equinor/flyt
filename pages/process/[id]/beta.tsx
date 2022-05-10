import Head from "next/head";
import { SideSheet, Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { getProject } from "services/projectApi";
import { unknownErrorToString } from "utils/isError";
import { Layouts } from "layouts/LayoutWrapper";
import { SideBarBody } from "../../../components/SideBarBody";
import { getVSMObject } from "../../../services/vsmObjectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { getMyAccess } from "../../../utils/getMyAccess";
import { CanvasTopBar } from "../../../components/canvasTopBar";
import { Loading } from "../../../components/loading";
import { ErrorMessage } from "../../../components/errorMessage";
import useWindowSize from "../../../hooks/useWindowSize";
import CanvasImposter from "../../../components/canvasImposter";

// const Canvas = dynamic(() => import("../../../components/noCanvas"), {
//   ssr: false,
// });
const Canvas = dynamic(() => import("../../../components/simpleCanvas"), {
  ssr: false,
});
// const Canvas = dynamic(() => import("../../../components/canvas/Beta"), {
//   ssr: false,
// });

function SideSheetContent(props: { cardId: number; canEdit: boolean }) {
  const { cardId, canEdit } = props;

  const { data, error, isLoading } = useQuery(["card", cardId], () =>
    getVSMObject(props.cardId)
  );
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <SideBarBody
      key={cardId} // makes sure the component is re-rendered when the cardId changes
      selectedObject={data}
      onChangeName={(event: { target: { value: string } }): void => {
        throw new Error("Method not implemented.");
      }}
      onChangeRole={(event: { target: { value: string } }): void => {
        throw new Error("Function not implemented.");
      }}
      onChangeTime={(e: { time: number; unit: string }): void => {
        throw new Error("Function not implemented.");
      }}
      setShowNewTaskSection={(value: boolean): void => {
        throw new Error("Function not implemented.");
      }}
      canEdit={canEdit}
    />
  );
}

function CardSideSheet(props: {
  onClose: () => void;
  card: number;
  canEdit: boolean;
}) {
  const { card, onClose, canEdit } = props;
  const { width } = useWindowSize();
  return (
    <SideSheet
      title={card ? `Card ${card}` : "Select a card"}
      onClose={onClose}
      variant="large"
      open={!!card}
      style={{
        // height: "calc(100% - 64px)",
        width: width <= 480 && "100%",
        top: "64px", // Place right under the top bar
      }}
    >
      <SideSheetContent cardId={card} canEdit={canEdit} />
    </SideSheet>
  );
}

export default function Project() {
  const router = useRouter();
  const { id } = router.query;
  const { data: process, error } = useQuery(
    ["project", id],
    () => getProject(id),
    {
      enabled: !!id,
    }
  );
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(process, account);
  const isAdmin = myAccess === "Admin";
  const canEdit = isAdmin || myAccess == "Contributor";

  const [selectedCard, setSelectedCard] = React.useState<number | null>(null);

  useEffect(() => {
    console.log(selectedCard);
  }, [selectedCard]);

  if (error) {
    return (
      <div>
        <Head>
          <title>Flyt | Process {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
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
        <title>{process?.name || `Flyt | Process ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CanvasTopBar process={process} />
        <CardSideSheet
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          canEdit={canEdit}
        />
        {/*<Canvas />*/}
        <CanvasImposter
          onClickCard={(cardId) => console.log(cardId)}
          // onClickCard={(cardId) => setSelectedCard(cardId)}
        />
      </main>
    </div>
  );
}

Project.layout = Layouts.Empty;
Project.auth = true;

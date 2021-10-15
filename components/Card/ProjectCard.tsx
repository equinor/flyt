import React, { useState } from "react";
import styles from "./Card.module.scss";
import { UserDots } from "./UserDots";
import { vsmProject } from "../../interfaces/VsmProject";
import { useMutation, useQueryClient } from "react-query";
import { faveProject, unfaveProject } from "services/projectApi";
import Heart from "components/Heart";
import { Scrim } from "@equinor/eds-core-react";
import { AccessBox } from "components/AccessBox";
import { useAccount, useMsal } from "@azure/msal-react";
import { getMyAccess } from "utils/getMyAccess";
import ProjectCardHeader from "./ProjectCardHeader";
import { useRouter } from "next/router";

export function ProjectCard(props: { vsm: vsmProject }): JSX.Element {
  const { userIdentity: createdBy } = props.vsm.created;
  const queryClient = useQueryClient();
  const [isMutatingFavourite, setIsMutatingFavourite] = useState(false);
  const router = useRouter();

  const [visibleScrim, setVisibleScrim] = useState(false);
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(props.vsm, account);
  const isAdmin = myAccess === "Admin";

  const handleSettled = () => {
    queryClient.invalidateQueries().then(() => setIsMutatingFavourite(false));
  };

  const faveMutation = useMutation(
    () => {
      setIsMutatingFavourite(true);
      return faveProject(props.vsm.vsmProjectID);
    },
    {
      onSettled: handleSettled,
    }
  );

  const unfaveMutation = useMutation(
    () => {
      setIsMutatingFavourite(true);
      return unfaveProject(props.vsm.vsmProjectID);
    },
    {
      onSettled: handleSettled,
    }
  );

  return (
    <>
      <button
        style={{
          padding: "0",
          marginRight: "16px",
          marginBottom: "16px",
          border: "none",
          textAlign: "inherit",
          display: "inherit",
          backgroundColor: "unset",
        }}
        onClick={() => router.push(`/process/${props.vsm.vsmProjectID}`)}
      >
        <div className={styles.card}>
          <div className={styles.topSection}>
            <ProjectCardHeader vsm={props.vsm} />
            <Heart
              isFavourite={props.vsm.isFavorite}
              fave={() => faveMutation.mutate()}
              unfave={() => unfaveMutation.mutate()}
              isLoading={isMutatingFavourite}
            />
          </div>
          <div className={styles.bottomSection}>
            {createdBy && (
              <UserDots
                users={[
                  `${createdBy}`,
                  ...props.vsm.userAccesses.map((u) => u.user),
                ]}
                setVisibleScrim={(any: boolean) => setVisibleScrim(any)}
              />
            )}
          </div>
        </div>
      </button>

      {visibleScrim && (
        <Scrim onClose={() => setVisibleScrim(false)} isDismissable>
          <AccessBox
            project={props.vsm}
            handleClose={() => setVisibleScrim(false)}
            isAdmin={isAdmin}
          />
        </Scrim>
      )}
    </>
  );
}

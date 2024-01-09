import { Button, Icon, Scrim, Tooltip } from "@equinor/eds-core-react";
import React, { useState } from "react";
import { faveProject, unfaveProject } from "services/projectApi";
import { useAccount, useMsal } from "@azure/msal-react";
import { useMutation, useQueryClient } from "react-query";

import { AccessBox } from "components/AccessBox";
import Heart from "components/Heart";
import Labels from "components/Labels/Labels";
import ManageLabelBox from "components/Labels/ManageLabelBox";
import ProjectCardHeader from "./ProjectCardHeader";
import { UserDots } from "./UserDots";
import { getMyAccess } from "utils/getMyAccess";
import styles from "./Card.module.scss";
import { tag } from "@equinor/eds-icons";
import { vsmProject } from "../../interfaces/VsmProject";
import Link from "next/link";

export function ProjectCard(props: { vsm: vsmProject }): JSX.Element {
  const queryClient = useQueryClient();
  const [isMutatingFavourite, setIsMutatingFavourite] = useState(false);

  const [visibleScrim, setVisibleScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const myAccess = getMyAccess(props.vsm, account);
  const isAdmin = myAccess === "Admin" || myAccess === "Owner";
  const userCanEdit = isAdmin || myAccess == "Contributor";

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
      <Link href={`/process/${props.vsm.vsmProjectID}`}>
        <div
          style={{
            padding: "0",
            marginBottom: "16px",
            border: "none",
            textAlign: "inherit",
            backgroundColor: "unset",
            width: "100%",
          }}
        >
          <div className={styles.card}>
            <div className={styles.section}>
              <ProjectCardHeader vsm={props.vsm} />
              <Heart
                isFavourite={props.vsm.isFavorite}
                fave={() => faveMutation.mutate()}
                unfave={() => unfaveMutation.mutate()}
                isLoading={isMutatingFavourite}
              />
            </div>
            <div className={`${styles.section} ${styles.labelSection}`}>
              <Labels labels={props.vsm.labels} />
            </div>
            <div className={`${styles.section} ${styles.bottomSection}`}>
              <UserDots
                userAccesses={props.vsm.userAccesses}
                setVisibleScrim={(any: boolean) => setVisibleScrim(any)}
              />
              {userCanEdit && (
                <Tooltip title="Manage process labels" placement="right">
                  <Button
                    color="primary"
                    variant="ghost_icon"
                    style={{ height: "30px", width: "30px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setVisibleLabelScrim(true);
                    }}
                  >
                    <Icon data={tag} />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Scrim
        open={visibleScrim}
        onClose={() => setVisibleScrim(false)}
        isDismissable
      >
        <AccessBox
          project={props.vsm}
          handleClose={() => setVisibleScrim(false)}
          isAdmin={isAdmin}
        />
      </Scrim>

      <ManageLabelBox
        handleClose={() => setVisibleLabelScrim(false)}
        isVisible={visibleLabelScrim}
        process={props.vsm}
      />
    </>
  );
}

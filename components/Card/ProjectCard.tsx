import { Button, Icon, Scrim, Tooltip } from "@equinor/eds-core-react";
import { useState } from "react";
import { faveProject, unfaveProject } from "services/projectApi";
import { useMutation, useQueryClient } from "react-query";
import colors from "@/theme/colors";
import { AccessBox } from "components/AccessBox";
import { Heart } from "components/Heart";
import { Labels } from "components/Labels/Labels";
import { ManageLabelBox } from "components/Labels/ManageLabelBox";
import { ProjectCardHeader } from "./ProjectCardHeader";
import { UserDots } from "./UserDots";
import styles from "./Card.module.scss";
import { tag } from "@equinor/eds-icons";
import Link from "next/link";
import { Project } from "@/types/Project";
import { useAccess } from "../canvas/hooks/useAccess";

type ProjectCardProps = {
  project: Project;
  readOnly?: boolean;
  onClick?: (vsm: Project) => void;
  selected?: boolean;
};

export const ProjectCard = ({
  project,
  readOnly,
  onClick,
  selected,
}: ProjectCardProps) => {
  const queryClient = useQueryClient();
  const [isMutatingFavourite, setIsMutatingFavourite] = useState(false);

  const [visibleScrim, setVisibleScrim] = useState(false);
  const [visibleLabelScrim, setVisibleLabelScrim] = useState(false);

  const { isAdmin, userCanEdit } = useAccess(project);

  const handleSettled = () => {
    queryClient.invalidateQueries().then(() => setIsMutatingFavourite(false));
  };

  const faveMutation = useMutation(
    () => {
      setIsMutatingFavourite(true);
      return faveProject(project.vsmProjectID);
    },
    {
      onSettled: handleSettled,
    }
  );

  const unfaveMutation = useMutation(
    () => {
      setIsMutatingFavourite(true);
      return unfaveProject(project.vsmProjectID);
    },
    {
      onSettled: handleSettled,
    }
  );

  return (
    <>
      <Link
        href={`/process/${project.vsmProjectID}`}
        onClickCapture={(e) => readOnly && e.preventDefault()}
        className={styles.card}
        style={{
          background: selected ? colors.EQUINOR_SELECTED_HIGHLIGHT : "",
        }}
        onClick={() => onClick && onClick(project)}
      >
        <div className={styles.section}>
          <ProjectCardHeader project={project} />
          <Heart
            isFavourite={project.isFavorite ?? false}
            fave={() => faveMutation.mutate()}
            unfave={() => unfaveMutation.mutate()}
            isLoading={isMutatingFavourite}
            disabled={readOnly}
          />
        </div>
        <div className={`${styles.section} ${styles.labelSection}`}>
          <Labels labels={project.labels} />
        </div>
        <div className={`${styles.section} ${styles.bottomSection}`}>
          <UserDots
            userAccesses={project.userAccesses}
            onClick={() => !readOnly && setVisibleScrim(true)}
          />
          {userCanEdit && !readOnly && (
            <Tooltip title="Manage process labels" placement="right">
              <Button
                color="primary"
                variant="ghost_icon"
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
      </Link>

      <Scrim
        open={visibleScrim}
        onClose={() => setVisibleScrim(false)}
        isDismissable
      >
        <AccessBox
          project={project}
          handleClose={() => setVisibleScrim(false)}
          isAdmin={isAdmin}
        />
      </Scrim>

      <ManageLabelBox
        handleClose={() => setVisibleLabelScrim(false)}
        isVisible={visibleLabelScrim}
        process={project}
      />
    </>
  );
};

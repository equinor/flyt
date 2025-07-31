import { Button, Icon, Scrim } from "@equinor/eds-core-react";
import { unarchive } from "@equinor/eds-icons";
import React, { useState } from "react";
import { ExportModal } from "./ExportModal";

type ExportButtonProps = {
  problemChecked: boolean;
  ideaChecked: boolean;
  questionChecked: boolean;
  riskChecked: boolean;
};

export const ExportButton = (props: ExportButtonProps) => {
  const { problemChecked, ideaChecked, questionChecked, riskChecked } = props;
  const [isExportModalVisible, setisExportModalVisible] = useState(false);
  const handleClose = () => {
    setisExportModalVisible(false);
  };
  return (
    <>
      <Button onClick={() => setisExportModalVisible(true)}>
        Export PQIRs
        <Icon data={unarchive} />
      </Button>
      <Scrim open={isExportModalVisible} onClose={handleClose} isDismissable>
        <ExportModal
          handleClose={handleClose}
          problemChecked={problemChecked}
          ideaChecked={ideaChecked}
          questionChecked={questionChecked}
          riskChecked={riskChecked}
        />
      </Scrim>
    </>
  );
};

import { Button, Icon } from "@equinor/eds-core-react";
import { download_tree_as_png } from "./utils/downloadVSMImage";
import React, { useEffect, useState } from "react";
import { useStoreDispatch, useStoreState } from "../../hooks/storeHooks";
import { useAccount, useMsal } from "@azure/msal-react";
import { getMyAccess } from "../../utils/getMyAccess";
import { loadAssets } from "./utils/LoadAssets";
import { assets } from "./utils/AssetFactory";
import { getApp } from "./utils/PixiApp";
import { recursiveTree } from "./utils/recursiveTree";
import { useMutation, useQuery } from "react-query";
import { getProject } from "../../services/projectApi";
import { useRouter } from "next/router";

export default function Download() {
  const router = useRouter();
  const { id } = router.query;
  const { data: project } = useQuery(["project", id], () => getProject(id));
  const [assetsAreReady, setAssetsAreReady] = useState(false);
  const [tree, setTree] = useState(null);
  // "Constructor"
  useEffect(() => {
    const cleanupAssets = loadAssets(assets, () => setAssetsAreReady(true));
    return () => {
      cleanupAssets();
      getApp().stage.removeChildren();
      getApp()?.stop();
    };
  }, []);

  useEffect(() => {
    if (assetsAreReady && project && project.objects) {
      const newTree = recursiveTree(
        project.objects[0],
        0,
        true,
        {
          setSnackMessage: () => {
            //ignore
          },
        },
        () => {
          //ignore
        },
        () => {
          //ignore
        }
      );
      setTree(newTree);
    }
  }, [assetsAreReady, project]);

  if (!tree) {
    return <p>Generating tree</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 200,
      }}
    >
      <Button
        variant={"contained"}
        title={"Download VSM"}
        onClick={() => download_tree_as_png(project, tree)}
      >
        <Icon name={"download"} />
        Download
      </Button>
    </div>
  );
}

import { vsmProject } from "../interfaces/VsmProject";
import useWindowSize from "../hooks/useWindowSize";
import { useRouter } from "next/router";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { faveProcess, unFaveProcess } from "../services/projectApi";
import { Button, Icon, Input, Menu, TopBar } from "@equinor/eds-core-react";
import { HomeButton } from "../layouts/homeButton";
import { arrow_drop_down, arrow_drop_up, menu } from "@equinor/eds-icons";
import Heart from "./Heart";
import { duplicateProcess } from "../utils/duplicateProcess";
import { RightTopBarSection } from "./RightTopBarSection";

export function CanvasTopBar(props: { process: vsmProject }) {
  const { width } = useWindowSize();

  const router = useRouter();
  const process = props.process;
  const processMenuAnchorEl = React.useRef<HTMLButtonElement>(null);
  const processMenuSmallAnchorEl = React.useRef<HTMLButtonElement>(null);
  const [isProcessMenuOpen, setIsProcessMenuOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const faveMutation = useMutation((id: number) => faveProcess(id), {
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });
  const unFaveMutation = useMutation((id: number) => unFaveProcess(id), {
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  if (width <= 850) {
    return (
      <TopBar>
        <TopBar.Header>
          <HomeButton />
        </TopBar.Header>
        <TopBar.CustomContent>
          <Input
            defaultValue={props.process?.name}
            // readOnly // todo: readonly if not editable
            style={{ textAlign: "center" }}
          />
        </TopBar.CustomContent>
        <TopBar.Actions>
          <Button
            variant={"ghost"}
            onClick={() => setIsProcessMenuOpen(!isProcessMenuOpen)}
            ref={processMenuSmallAnchorEl}
          >
            <Icon data={menu} />
          </Button>
          <Menu
            anchorEl={processMenuSmallAnchorEl.current}
            open={isProcessMenuOpen}
            onBlur={() => setIsProcessMenuOpen(false)}
          >
            <Menu.Item
              onClick={() => {
                if (props.process?.isFavorite) {
                  unFaveMutation.mutate(props.process.vsmProjectID);
                } else {
                  faveMutation.mutate(props.process.vsmProjectID);
                }
              }}
            >
              Favorite
              <Heart
                isFavourite={props.process?.isFavorite}
                isLoading={faveMutation.isLoading || unFaveMutation.isLoading}
              />
            </Menu.Item>
            <Menu.Item onClick={() => duplicateProcess(process, router)}>
              Duplicate
            </Menu.Item>
            <Menu.Item disabled>Delete</Menu.Item>

            <Menu.Item disabled>Share</Menu.Item>
            <Menu.Item disabled>Power BI</Menu.Item>
            <Menu.Item disabled>Wiki</Menu.Item>
            <Menu.Item disabled>Give feedback</Menu.Item>
            <Menu.Item disabled>User</Menu.Item>
          </Menu>
        </TopBar.Actions>
      </TopBar>
    );
  }

  return (
    <TopBar style={{ position: "absolute", width: "100%" }}>
      <TopBar.Header>
        <HomeButton />
      </TopBar.Header>
      <TopBar.CustomContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Input
            defaultValue={props.process?.name}
            // readOnly // todo: readonly if not editable
            style={{ textAlign: "center" }}
          />
          <Button
            style={{ minWidth: 48 }} // looks squished without this, probably a bug
            variant={"ghost_icon"}
            ref={processMenuAnchorEl}
            onClick={() => setIsProcessMenuOpen(!isProcessMenuOpen)}
          >
            <Icon
              data={isProcessMenuOpen ? arrow_drop_up : arrow_drop_down}
              size={24}
            />
          </Button>
          <Menu
            anchorEl={processMenuAnchorEl.current}
            open={isProcessMenuOpen}
            onBlur={() => setIsProcessMenuOpen(false)}
          >
            <Menu.Item onClick={() => duplicateProcess(process, router)}>
              Duplicate
            </Menu.Item>
            <Menu.Item>Delete</Menu.Item>
          </Menu>
          <Button
            style={{ minWidth: 48 }} // looks squished without this
            variant={"ghost_icon"}
            onClick={() => {
              if (props.process?.isFavorite) {
                unFaveMutation.mutate(props.process.vsmProjectID);
              } else {
                faveMutation.mutate(props.process.vsmProjectID);
              }
            }}
          >
            <Heart
              isFavourite={props.process?.isFavorite}
              isLoading={faveMutation.isLoading || unFaveMutation.isLoading}
            />
          </Button>
        </div>
      </TopBar.CustomContent>
      <RightTopBarSection />
    </TopBar>
  );
}

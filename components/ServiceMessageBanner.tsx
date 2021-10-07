import { Banner, Button, Icon } from "@equinor/eds-core-react";
import React from "react";
import { high_priority } from "@equinor/eds-icons";
import { useQuery } from "react-query";
import style from "./ServiceMessageBanner.module.scss";
import { getServiceMessage } from "../services/CommonAPIService";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import getConfig from "next/config";

export const ServiceMessageBanner = () => {
  const { publicRuntimeConfig } = getConfig();
  const { data, isLoading, error } = useQuery("ServiceMessage", () =>
    getServiceMessage(publicRuntimeConfig.ENVIRONMENT, "Flyt")
  );

  if (isLoading || error) return null;

  return (
    <>
      <Banner className={style.banner}>
        <Banner.Icon variant="warning">
          <Icon data={high_priority} />
        </Banner.Icon>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ReactMarkdown remarkPlugins={[gfm]}>{data?.message}</ReactMarkdown>
        </div>
        {data?.urlString && (
          <Banner.Actions>
            <a href={data?.urlString} target="_blank" rel="noopener noreferrer">
              <Button variant={"ghost"}>Read more</Button>
            </a>
          </Banner.Actions>
        )}
      </Banner>
    </>
  );
};

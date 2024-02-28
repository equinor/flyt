import { Banner, Icon } from "@equinor/eds-core-react";
import React from "react";
import { high_priority } from "@equinor/eds-icons";
// import { useQuery } from "react-query";
import style from "./ServiceMessageBanner.module.scss";
// import { getServiceMessage } from "../services/CommonAPIService";
import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
// import getConfig from "next/config";

export const ServiceMessageBanner = () => {
  // const { publicRuntimeConfig } = getConfig();
  // const { data, isLoading, error } = useQuery("ServiceMessage", () =>
  //   getServiceMessage(publicRuntimeConfig.ENVIRONMENT, "Flyt")
  // );

  // if (isLoading || error) return null;
  // if (data && !data.status) return null; // https://github.com/equinor/flyt/issues/259#issue-1034675684

  return (
    <>
      <Banner className={style.banner}>
        <Banner.Icon variant="warning">
          <Icon data={high_priority} />
        </Banner.Icon>
        <div style={{ display: "flex", alignItems: "center" }}>
          <ReactMarkdown remarkPlugins={[gfm]}>
            Flyt 1.0 is now in read-only mode. You can view your data, but
            changes can no longer be made.
          </ReactMarkdown>
        </div>
        {/* {data?.urlString && (
          <Banner.Actions>
            <a
              href={encodeURI(data.urlString)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant={"ghost"}>Read more</Button>
            </a>
          </Banner.Actions>
        )} */}
      </Banner>
    </>
  );
};

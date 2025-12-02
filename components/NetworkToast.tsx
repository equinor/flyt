import React, { useEffect, useState } from "react";
import { Button, Icon } from "@equinor/eds-core-react";
import {
  check_circle_outlined,
  close,
  close_circle_outlined,
  refresh,
  warning_outlined,
  wifi,
  wifi_off,
} from "@equinor/eds-icons";
import styles from "./NetworkToast.module.scss";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useWebSocket } from "./canvas/hooks/useWebSocket";

export const NetworkToast: React.FC = () => {
  const snackMessage = useStoreState((s: any) => s.networkSnackMessage) as
    | string
    | null;
  const downloadSnackbar = useStoreState(
    (s: any) => s.downloadSnackbar
  ) as boolean;
  const setSnackMessage = useStoreActions((a: any) => a.setNetworkSnackMessage);
  const setDownloadSnackbar = useStoreActions(
    (a: any) => a.setDownloadSnackbar
  );
  const { socketConnected, socketReason, reconnect } = useWebSocket();
  const message = snackMessage ?? "";
  const lower = message.toLowerCase();

  const isNetworkMessage =
    downloadSnackbar &&
    !!message &&
    (lower.includes("offline") || lower.includes("reconnect"));
  const isOffline = lower.includes("offline");
  const isReconnected = lower.includes("reconnected");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOffline) return;

    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        reconnect();
        setCountdown(3);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isOffline, countdown, reconnect]);

  useEffect(() => {
    if (!isReconnected) return;
    const timer = setTimeout(() => {
      setSnackMessage(null);
      setDownloadSnackbar(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isReconnected, setSnackMessage, setDownloadSnackbar]);

  if (!isNetworkMessage) return null;

  // const IconData=isOffline?warning_outlined:check_circle_outlined;
  const IconColor = isOffline ? "#9B4900" : "#007079";
  const containerClass = isOffline
    ? styles.networkOffline
    : styles.networkReconnect;

  const handleClose = () => {
    setSnackMessage(null);
    setDownloadSnackbar(false);
  };
  const handleRetry = () => {
    if (!navigator.onLine) {
      setDownloadSnackbar(true);
      return;
    }
    reconnect();
  };

  return (
    <>
      {isOffline && <div className={styles.bannerContainer}></div>}

      <div
        className={`${styles.banner} ${
          isOffline ? styles.offlineBanner : styles.onlineBanner
        }`}
        role="status"
        aria-live="polite"
      >
        <div className={styles.left}>
          <div className={styles.iconWrapper}>
            {isOffline ? (
              <div className={styles.disconnectedIconCircle}>
                <Icon data={wifi_off} size={24} color={IconColor} />
              </div>
            ) : (
              <div className={styles.reconnectedIconCircle}>
                <Icon data={wifi} size={24} color={IconColor} />
              </div>
            )}
          </div>
          <span className={styles.message}>{message}</span>
        </div>

        {isOffline ? (
          <div className={styles.right}>
            <span className={styles.reconnectText}>
              Trying to reconnect in {countdown} seconds...
            </span>
            <Button
              variant="contained"
              onClick={handleRetry}
              className={styles.retryBtn}
              aria-label="Try again now"
            >
              <Icon data={refresh} size={24} className={styles.tryText} /> Try
              Now
            </Button>
          </div>
        ) : (
          <Icon
            data={close}
            size={16}
            onClick={handleClose}
            className={styles.closeBtn}
          />
        )}
      </div>
    </>
  );
};
export default NetworkToast;

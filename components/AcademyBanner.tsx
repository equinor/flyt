import { Icon } from "@equinor/eds-core-react";
import style from "./AcademyBanner.module.scss";
import { close } from "@equinor/eds-icons";
import Logo from "../public/academy_banner_logo.png";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import colors from "@/theme/colors";

const AcademyBanner = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showFlytAcademy, setShowFlytAcademy] = useLocalStorage(
    "showFlytAcademy",
    true
  );

  useEffect(() => {
    if (!showFlytAcademy) setIsOpen(false);
  }, [showFlytAcademy]);

  const handleClose = () => {
    setIsOpen((prev) => !prev);
    setShowFlytAcademy(false);
  };
  return isOpen ? (
    <div className={style.container}>
      <div className={style.banner_right}>
        <img src={Logo.src} alt="academy-logo" className={style.logo} />
        <p>Coming soon: Flyt Academy</p>
        <p>|</p>
        <span>
          Tutorials, practical guidance, and real-world examples to help you get
          more value from Flyt.
        </span>
      </div>
      <div className={style.close} onClick={handleClose}>
        <Icon data={close} color={colors.EQUINOR_PROMINENT} />
      </div>
    </div>
  ) : null;
};

export default AcademyBanner;

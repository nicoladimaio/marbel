import { IconType } from "react-icons";
import {
  FiLayers,
  FiDroplet,
  FiPackage,
  FiTool,
  FiZap,
  FiGrid,
} from "react-icons/fi";

export type ServiceItem = {
  key: string;
  title: string;
  description: string;
  href: string;
  icon: IconType;
};

export const servicesList: ServiceItem[] = [
  {
    key: "ristrutturazioni",
    title: "Ristrutturazioni complete",
    description:
      "Coordinamento totale di demolizioni, impianti e finiture con un unico project manager.",
    icon: FiLayers,
    href: "/servizi",
  },
  {
    key: "bagni",
    title: "Bagni e spa sartoriali",
    description:
      "Rivestimenti waterproof, illuminazione scenografica e accessori di alta gamma.",
    icon: FiDroplet,
    href: "/servizi/bagni",
  },
  {
    key: "cucine",
    title: "Cucine su misura",
    description:
      "Layout funzionali, integrazione elettrodomestici e materiali premium per la zona living.",
    icon: FiPackage,
    href: "/servizi/cucine",
  },
  {
    key: "idraulici",
    title: "Impianti idraulici",
    description:
      "Realizziamo e adeguiamo impianti idrici certificati con tecnici specializzati.",
    icon: FiTool,
    href: "/servizi/idraulici",
  },
  {
    key: "elettrici",
    title: "Impianti elettrici",
    description:
      "Quadri, distribuzione e domotica seguendo le normative CEI e tempi garantiti.",
    icon: FiZap,
    href: "/servizi/elettrici",
  },
  {
    key: "pavimenti",
    title: "Pavimenti e rivestimenti",
    description:
      "Posa sartoriale di superfici tecniche e naturali per interni ed esterni.",
    icon: FiGrid,
    href: "/servizi/pavimenti",
  },
];

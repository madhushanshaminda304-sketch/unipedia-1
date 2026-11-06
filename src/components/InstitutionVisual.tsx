import React from "react";
import { InstitutionMark } from "./PortalPrimitives";
const photographs: Record<
  string,
  { src: string; name: string; credit: string; license: string }
> = {
  CMB: {
    src: "/images/colombo-college-house.jpg",
    name: "College House, University of Colombo",
    credit: "https://commons.wikimedia.org/wiki/File:UoC_College_House.jpg",
    license: "https://creativecommons.org/licenses/by-sa/3.0/",
  },
  "nsbm-green-university": {
    src: "/images/nsbm-engineering.jpg",
    name: "NSBM Green University, Faculty of Engineering",
    credit:
      "https://commons.wikimedia.org/wiki/File:NSBM_Green_University_-_FOE.jpg",
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
};
export const hasInstitutionPhotograph = (id: string) => !!photographs[id];
export function InstitutionVisual({
  id,
  name,
  large = false,
}: {
  id: string;
  name: string;
  large?: boolean;
}) {
  const photo = photographs[id];
  if (!photo)
    return (
      <div
        className={`institution-visual institution-visual-fallback${large ? " large" : ""}`}
      >
        <InstitutionMark name={name} />
        {large && <span>{name}</span>}
      </div>
    );
  return (
    <figure className={`institution-visual${large ? " large" : ""}`}>
      <img
        src={photo.src}
        alt={photo.name}
        width={large ? 420 : 120}
        height={large ? 260 : 100}
        loading="lazy"
      />
      {large && (
        <figcaption>
          {photo.name}.{" "}
          <a href={photo.credit}>{id === "CMB" ? "Cossde" : "Osanda97"}</a>,{" "}
          <a href={photo.license}>
            {id === "CMB" ? "CC BY-SA 3.0" : "CC BY-SA 4.0"}
          </a>
          . Cropped for display.
        </figcaption>
      )}
    </figure>
  );
}

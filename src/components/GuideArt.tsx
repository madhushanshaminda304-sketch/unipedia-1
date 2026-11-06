import React from "react";
import {
  GraduationCapIcon,
  NotebookIcon,
  PathIcon,
  WalletIcon,
} from "@phosphor-icons/react";
export function GuideArt({ index }: { index: number }) {
  const Icon = [GraduationCapIcon, NotebookIcon, PathIcon, WalletIcon][
    index % 4
  ];
  return (
    <span
      className={`premium-guide-art premium-guide-art-${index % 4}`}
      aria-hidden="true"
    >
      <span className="guide-paper guide-paper-back" />
      <span className="guide-paper guide-paper-front">
        <Icon size={52} weight="duotone" />
        <span className="guide-paper-rule" />
        <span className="guide-paper-rule short" />
      </span>
    </span>
  );
}

import React from "react";
import type { NonStatePathway } from "../data/sriLankaUgcSnapshot";
import type { ProgramCutoffViewRow } from "../data/ugc/types";
import { Modal } from "./Modal";
import { CourseDetails } from "./CourseDetails";
export interface ProgramDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  program?: ProgramCutoffViewRow | null;
  pathway?: NonStatePathway | null;
}
export function ProgramDetailDrawer({
  isOpen,
  onClose,
  program,
}: ProgramDetailDrawerProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Course requirements & source"
      wide
    >
      {program ? (
        <CourseDetails program={program} />
      ) : (
        <p>This record is unavailable in the current catalog.</p>
      )}
    </Modal>
  );
}

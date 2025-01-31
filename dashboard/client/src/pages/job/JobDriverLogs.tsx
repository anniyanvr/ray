import React, { useContext } from "react";
import { GlobalContext } from "../../App";
import { MultiTabLogViewer } from "../../common/MultiTabLogViewer";
import { UnifiedJob } from "../../type/job";

type JobDriverLogsProps = {
  job: Pick<
    UnifiedJob,
    | "job_id"
    | "driver_node_id"
    | "submission_id"
    | "driver_agent_http_address"
    | "driver_info"
  >;
};

export const JobDriverLogs = ({ job }: JobDriverLogsProps) => {
  const { driver_node_id, submission_id } = job;
  const filename = submission_id
    ? `job-driver-${submission_id}.log`
    : undefined;

  const { ipLogMap } = useContext(GlobalContext);

  let link: string | undefined;

  if (job.driver_agent_http_address) {
    link = `/logs/${encodeURIComponent(
      `${job.driver_agent_http_address}/logs`,
    )}`;
  } else if (job.driver_info && ipLogMap[job.driver_info.node_ip_address]) {
    link = `/logs/${encodeURIComponent(
      ipLogMap[job.driver_info.node_ip_address],
    )}`;
  }

  if (link && job.job_id) {
    link += `?fileName=${job.job_id}`;
  } else {
    // Don't show "other logs" link if link is not available
    // or job_id does not exist.
    link = undefined;
  }

  // TODO(aguo): Support showing message for jobs not created via ray job submit
  // instead of hiding the driver logs
  return (
    <MultiTabLogViewer
      tabs={[
        {
          title: "driver",
          nodeId: driver_node_id,
          filename,
        },
      ]}
      otherLogsLink={link}
    />
  );
};

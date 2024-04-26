import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { db } from "~/lib/database/firestore.server";

export const SetTaskStatusSchema = z.object({
  _action: z.literal("setTaskStatus"),
  newStatus: z.enum(["complete", "incomplete"]),
});

export const setTaskStatus = (
  weekplanId: string,
  taskId: string,
  status: boolean
) =>
  makeDomainFunction(SetTaskStatusSchema)(async (data) => {
    const { newStatus } = data;
    const updateData = {
      [`taskStatus.${taskId}`]: newStatus === "complete" ? true : false,
    };

    return db.weekplan.update({ weekplanId, data: updateData });
  });

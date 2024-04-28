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

export const recordOdometerSchema = z.object({
  _action: z.literal("recordOdometer"),
  odometer: z.coerce.number().min(10),
});

export const recordOdometer = (weekplanId: string, taskId: string) =>
  makeDomainFunction(recordOdometerSchema)(async (data) => {
    const { odometer } = data;
    const updateData = {
      [`dataEntry.odometer`]: odometer,
      [`taskStatus.${taskId}`]: true,
    };

    return db.weekplan.update({
      weekplanId: weekplanId,
      data: updateData,
    });
  });

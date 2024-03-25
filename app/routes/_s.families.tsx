import { Outlet } from "@remix-run/react";
import { ContainerPadded } from "~/components/common/containers";



export default function ServicePeriods() {
  return (
    <ContainerPadded>

      <Outlet />
    </ContainerPadded>
  );
}
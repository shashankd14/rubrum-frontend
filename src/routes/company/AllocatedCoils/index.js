import React from "react";
import RegisterList from "../common/RegisterList";

const allocatedCoilsConfig = {
  title: "Allocated Coils",
  variant: "allocatedCoils",
  listTitle: "Orders List",
  listSubtitle:
    "Operational view for received, in-progress, ready-to-deliver and dispatched coils.",
};

const AllocatedCoils = (props) => (
  <RegisterList {...props} screenConfig={allocatedCoilsConfig} />
);

export default AllocatedCoils;

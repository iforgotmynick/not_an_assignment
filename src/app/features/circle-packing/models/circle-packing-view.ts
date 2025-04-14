import { Continent } from "../../../core/models/continent";
import { CircleTypes } from "./circle-types";

export interface CirclePackingView {
  type: CircleTypes;
  data: Continent | null;
  width: number | null;
  height: number | null;
}

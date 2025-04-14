import { Country } from "../../../core/models/country";

export interface CirclePackingNode {
  name: string;
  children?: CirclePackingNode[];
  value?: number;
  data?: Country;
};

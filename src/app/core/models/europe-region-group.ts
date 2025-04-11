import { Country } from "./country";

type EuropeRegion =
  | 'Northern Europe'
  | 'Western Europe'
  | 'Southern Europe'
  | 'Eastern Europe';

export type EuropeRegionGroup = {
  [R in EuropeRegion]: Country[];
};

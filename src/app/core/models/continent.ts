import { Continents } from '../constants/continents';
import { EuropeRegionGroup } from './europe-region-group';

export interface Continent {
  [Continents.EUROPE]: EuropeRegionGroup;
}

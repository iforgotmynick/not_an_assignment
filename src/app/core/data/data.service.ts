import { Injectable } from '@angular/core';
import data from '../../../assets/data/europe_population_enriched.json'
import { Continent } from '../models/continent';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly data: Continent = data;

  getData(): Continent {
    return data;
  }
}

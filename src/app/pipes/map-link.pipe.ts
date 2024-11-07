import { Pipe, PipeTransform } from '@angular/core';
import { Gasolinera } from '../models/gas-app.dto';

@Pipe({
  name: 'mapLink'
})
export class MapLinkPipe implements PipeTransform {

  transform(gasolinera: Gasolinera, ...args: unknown[]): unknown {
    return `https://maps.google.com/?q=${this.sanitizeValue(gasolinera.latitude)},${this.sanitizeValue(gasolinera.longitude)}`;
  }

  sanitizeValue(value: string): string {
    return value.replace(',', '.');
  }

}
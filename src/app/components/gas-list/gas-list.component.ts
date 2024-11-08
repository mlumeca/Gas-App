import { Component, Input, OnInit } from '@angular/core';
import { Gasolinera } from '../../models/gas-app.dto';
import { GasAppService } from '../../services/gas-app.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css'
})

export class GasListComponent implements OnInit {
  @Input() precioMinimo = 0;
  @Input() precioMax = 0;
  @Input() fuelType = undefined;
  codigoPostal = '';
  provinciasFiltrados: string[] = [];
  listadoGasolineras: Gasolinera[] = [];
  listadoGasolinerasOriginal: Gasolinera[] = [];
  isCollapsed = false;
  gasolineras: any[] = []; // Lista original de gasolineras
  gasolinerasFiltradas: any[] = []; // Lista filtrada de gasolineras
  comunidadesAutonomas: Observable<string[]> | undefined;
  comunidadControl = new FormControl('');
  provinciaControl = new FormControl('');
  selectedComunidad: string | null = null;
  selectedProvincia: string | null = null;
  provincias: Observable<string[]> | undefined;
  fuelFilter = {
    gasoleoA: true,
    gasoleoB: true,
    gasolina95: true,
    gasolina98: true,
    hidrogeno: true
  };

  constructor(private gasService: GasAppService) { }

  ngOnInit() {
    this.gasService.getGasList().subscribe((respuesta) => {
      const respuestaEnString = JSON.stringify(respuesta);
      let parsedData;
      try {
        parsedData = JSON.parse(respuestaEnString);
        let arrayGasolineras = parsedData['ListaEESSPrecio'];
        this.listadoGasolineras = this.cleanProperties(arrayGasolineras);
        this.listadoGasolinerasOriginal = [...this.listadoGasolineras];
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });
  }

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  private cleanProperties(arrayGasolineras: any) {
    let newArray: Gasolinera[] = [];
    arrayGasolineras.forEach((gasolineraChusquera: any) => {
      const gasolinera = new Gasolinera(
        gasolineraChusquera['IDEESS'],
        gasolineraChusquera['Rótulo'],
        gasolineraChusquera['Precio Gasolina 95 E5'].replace(',', '.'),
        gasolineraChusquera['Precio Gasoleo A'].replace(',', '.'),
        gasolineraChusquera['C.P.'],
        gasolineraChusquera['Municipio'],
        gasolineraChusquera['Dirección'],
        gasolineraChusquera['Localidad'],
        this.capitalizeFirstLetter(gasolineraChusquera['Provincia']),
        gasolineraChusquera['Latitud'],
        gasolineraChusquera['Longitud'],
        gasolineraChusquera['Horario'],
        gasolineraChusquera['Remisión'],
        gasolineraChusquera['Precio Biodiesel'].replace(',', '.'),
        gasolineraChusquera['Precio Gasolina 98 E5'].replace(',', '.'),
        gasolineraChusquera['Precio Hidrogeno'].replace(',', '.'),
        gasolineraChusquera['Precio Gasoleo B'].replace(',', '.')
      );
      newArray.push(gasolinera);
    });
    return newArray;
  }

  aplicarPrecioTipo() {
    const min = this.precioMinimo || 0;
    const max = this.precioMax || Number.MAX_VALUE;
    const type = this.fuelType;

    this.listadoGasolineras = this.listadoGasolinerasOriginal.filter((gasolinera) => {
      const preciosCombustibles = [
        parseFloat(gasolinera.price95) || 0,
        parseFloat(gasolinera.priceGasoleoA) || 0,
        parseFloat(gasolinera.priceGasoleoB) || 0,
        parseFloat(gasolinera.priceGasolina98) || 0,
        parseFloat(gasolinera.priceHidrogeno) || 0,
        parseFloat(gasolinera.priceBiodiesel) || 0,
      ];
      return preciosCombustibles.some((precio) => precio >= min && precio <= max);
    });

    this.listadoGasolineras = this.listadoGasolinerasOriginal.filter(gasolinera => {
      return (
        (this.fuelFilter.gasoleoA && parseFloat(gasolinera.priceGasoleoA) > 0) ||
        (this.fuelFilter.gasoleoB && parseFloat(gasolinera.priceGasoleoB) > 0) ||
        (this.fuelFilter.gasolina95 && parseFloat(gasolinera.price95) > 0) ||
        (this.fuelFilter.gasolina98 && parseFloat(gasolinera.priceGasolina98) > 0) ||
        (this.fuelFilter.hidrogeno && parseFloat(gasolinera.priceHidrogeno) > 0)
      );
    });
  }

  aplicarUbicacion() {
    if (this.selectedComunidad) {
      this.gasService.getGasListPorComunidad(this.selectedComunidad).subscribe(data => {
        // this.gasolineras = data;
      });
    } else if (this.selectedProvincia) {
      this.gasService.getGasListPorProvincia(this.selectedProvincia).subscribe(data => {
        // this.gasolinerasFiltradas = data;

        // onComunidadChange(event: any) {
        //   this.selectedComunidad = event.value;
        //   if (this.selectedComunidad) {
        //     this.locationService.getProvincias(this.selectedComunidad).subscribe(data => {
        //       this.provincias = data; // Ajusta según la estructura de respuesta
        //     });
        //   } else {
        //     this.provincias = [];
        //     this.selectedProvincia = null;
        //   }
        //   this.selectedProvincia = null; // Resetear provincia al cambiar comunidad
        //   this.onFilterGasolineras();
        // }

        // onProvinciaChange(event: any) {
        //   this.selectedProvincia = event.value;
        //   this.onFilterGasolineras();
        // }

      });
    }
  }

  aplicarPostalCode() {
    if (this.codigoPostal == '') {
      this.listadoGasolineras = this.listadoGasolinerasOriginal;
    } else {
      this.listadoGasolineras = this.listadoGasolinerasOriginal.filter(gasolinera =>
        gasolinera.postalCode === this.codigoPostal
      );
    }
  }

  aplicarFiltros() {
    // Precio y tipo
    this.aplicarPrecioTipo()
    // Comunidad autónoma y provincia
    this.aplicarUbicacion()
    // Código postal
    this.aplicarPostalCode()
  }

  quitarFiltros() {
    this.gasolineras.push;
  }

  modificarLista(provincia: string) {
    if (this.provinciasFiltrados.includes(provincia)) {
      this.provinciasFiltrados = this.provinciasFiltrados.filter(pro => pro !== provincia);
    } else {
      this.provinciasFiltrados.push(provincia);
    }
  }

  cargarGasolineras(): void {
    this.gasolinerasFiltradas = [...this.gasolineras];
  }
}
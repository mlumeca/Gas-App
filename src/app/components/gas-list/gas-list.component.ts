import { Component, Input, OnInit } from '@angular/core';
import { Gasolinera } from '../../models/gas-app.dto';
import { GasAppService } from '../../services/gas-app.service';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css'
})
export class GasListComponent implements OnInit {
  codigoPostal = '';
  provinciasFiltrados: string[] = [];
  provincias: string[] = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona",
    "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad real", "Córdoba",
    "Cuenca", "Gerona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Jaén",
    "Coruña (a)", "Rioja (la)", "Palmas (las)", "León", "Lleida", "Lugo", "Madrid", "Málaga",
    "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Segovia",
    "Sevilla", "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia",
    "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
  ]

  listadoGasolineras: Gasolinera[] = [];
  listadoGasolinerasOriginal: Gasolinera[] = [];
  @Input() precioMinimo = 0;
  @Input() precioMax = 0;

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

  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  aplicarFiltroPrecio() {
    const min = this.precioMinimo || 0;
    const max = this.precioMax || Number.MAX_VALUE;

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
  }


  aplicarCodigoPostal() {
    if (this.codigoPostal == '') {
      this.listadoGasolineras = this.listadoGasolinerasOriginal;
    } else {
      this.listadoGasolineras = this.listadoGasolinerasOriginal.filter(gasolinera =>
        gasolinera.postalCode === this.codigoPostal
      );
    }
  }

  modificarLista(provincia: string) {
    if (this.provinciasFiltrados.includes(provincia)) {
      this.provinciasFiltrados = this.provinciasFiltrados.filter(pro => pro !== provincia);
    } else {
      this.provinciasFiltrados.push(provincia);
    }
  }

  filtrarProvinciaMultiple() {
    if (this.provinciasFiltrados.length === 0) {
      this.listadoGasolineras = this.listadoGasolinerasOriginal;
    } else {
      this.listadoGasolineras = this.listadoGasolinerasOriginal.filter(gasolinera =>
        this.provinciasFiltrados.includes(gasolinera.provincia)
      );
    }

  }
}


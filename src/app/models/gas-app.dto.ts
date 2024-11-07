export class Gasolinera {
    constructor(
      public id: string,
      public rotulo: string,
      public price95: string,
      public priceGasoleoA: string,
      public postalCode: string,
      public municipio: string,
      public direccion: string,
      public localidad: string,
      public provincia: string,
      public latitude: string,
      public longitude: string,
      public horario: string,
      public remision: string,
      public priceBiodiesel: string,
      public priceGasolina98: string,
      public priceHidrogeno: string,
      public priceGasoleoB: string
    ) { }
  }
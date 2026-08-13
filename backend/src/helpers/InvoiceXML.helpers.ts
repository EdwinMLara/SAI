import {XMLParser} from 'fast-xml-parser';
import {InvoiceInterface} from '@interfaces/Invoice.interfaces';

function cleanProductKey(rawKey: string): string {
  const cleaned = rawKey.replace(/^0+/, '');
  if (cleaned && /^\d+$/.test(cleaned)) {
    return cleaned;
  }
  return rawKey;
}

function getTaxInfo(concepto: any): { iva: number; rate: number } {
  const trasladosRaw = concepto?.['Impuestos']?.['Traslados']?.['Traslado'];
  const traslados = Array.isArray(trasladosRaw)
    ? trasladosRaw
    : trasladosRaw
      ? [trasladosRaw]
      : [];

  let iva = 0;
  let rate = 0;
  for (const traslado of traslados) {
    if (traslado['@_Impuesto'] === '002') {
      iva += Number(traslado['@_Importe'] || 0);
      rate = Math.max(rate, Number(traslado['@_TasaOCuota'] || 0));
    }
  }
  return { iva, rate };
}

export function parseInvoiceXML (xmlString: string): InvoiceInterface {
  
    const parser = new XMLParser({
        ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
    removeNSPrefix: true,
    });

    const result = parser.parse(xmlString); //Convierte la cadena xmlstring en un objeto de javascript
    const comprobante = result['Comprobante'];//Extraemos el nodo principal de la factura en este caso Comprobante

    if (!comprobante) {
    throw new Error('El archivo no es un CFDI válido');
  }

   const uuid = comprobante['Complemento']?.['TimbreFiscalDigital']?.['@_UUID'] || '';
  const serie = comprobante['@_Serie'] || '';
  const folio = comprobante['@_Folio'] || '';
  const emisor = comprobante['Emisor'] || {};
  const receptor = comprobante['Receptor'] || {};

  const conceptosRaw = comprobante['Conceptos']?.['Concepto'];
  const conceptos = Array.isArray(conceptosRaw)
    ? conceptosRaw
    : conceptosRaw
      ? [conceptosRaw]
      : [];

  const fecha = new Date(comprobante['@_Fecha']);

  return {
    invoiceId: uuid,
    reference: serie ? `${serie}-${folio}` : folio,
    emisorRfc: emisor['@_Rfc'] || '',
    emisorNombre: emisor['@_Nombre'] || '',
    receptorRfc: receptor['@_Rfc'] || '',
    receptorNombre: receptor['@_Nombre'] || '',
    date: fecha,
    expiration: new Date(fecha.getTime() + 30 * 24 * 60 * 60 * 1000),
    products: conceptos.map((concepto: any) => {
      const payment = Number(concepto['@_ValorUnitario'] || 0);
      const quantity = Number(concepto['@_Cantidad'] || 0);
      const { iva, rate } = getTaxInfo(concepto);
      const priceWithIva = rate > 0 ? payment * (1 + rate) : payment;
      return {
        key: cleanProductKey(
          concepto['@_NoIdentificacion'] || concepto['@_ClaveProdServ'] || ''
        ),
        claveProdServ: concepto['@_ClaveProdServ'] || '',
        claveUnidad: concepto['@_ClaveUnidad'] || '',
        description: concepto['@_Descripcion'] || '',
        quantity,
        status: 'activo',
        prices: {
          payment,
          iva,
          priceWithIva,
          distribution: 0,
          wholesale: 0,
          mid_wholesale: 0,
          retail: 0,
        },
        user_config: [],
      };
    }),
    payments: [],
    document: null,
    subtotal: Number(comprobante['@_SubTotal'] || 0),
    total: Number(comprobante['@_Total'] || 0),
  } as unknown as InvoiceInterface;

}
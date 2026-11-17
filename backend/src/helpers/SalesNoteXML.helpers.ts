import { XMLParser } from 'fast-xml-parser';

import responses from '@responses';
import AppError from '@utils/AppError';

export interface ParsedFiscalStamp {
  uuid: string;
  rfc: string | null;
  satStamp: string;
  issuerStamp: string;
  originalString: string;
  stampedAt: string;
  qrString: string;
}

interface XmlNode {
  [key: string]: unknown;
}

const asText = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value).trim();

const firstNode = (value: unknown): XmlNode | null => {
  if (Array.isArray(value)) {
    return (value[0] as XmlNode) ?? null;
  }
  return (value as XmlNode) ?? null;
};

const buildOriginalString = (
  version: string,
  uuid: string,
  stampedAt: string,
  rfcProvCertif: string,
  issuerStamp: string,
  noCertificadoSAT: string
): string =>
  `||${version}|${uuid}|${stampedAt}|${rfcProvCertif}|${issuerStamp}|${noCertificadoSAT}||`;

const buildQrString = (
  uuid: string,
  emisorRfc: string,
  receptorRfc: string,
  total: string,
  issuerStamp: string
): string => {
  const numericTotal = Number(total);
  const formattedTotal = Number.isFinite(numericTotal)
    ? numericTotal.toFixed(6)
    : '0.000000';
  const sealSuffix = issuerStamp.slice(-8);

  return (
    'https://verificacfdi.facturaelectronica.sat.gob.mx/?' +
    `id=${encodeURIComponent(uuid)}` +
    `&re=${encodeURIComponent(emisorRfc)}` +
    `&rr=${encodeURIComponent(receptorRfc)}` +
    `&tt=${encodeURIComponent(formattedTotal)}` +
    `&fe=${encodeURIComponent(sealSuffix)}`
  );
};

export function parseFiscalStampXML(xmlString: string): ParsedFiscalStamp {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseTagValue: false,
    removeNSPrefix: true,
  });

  const result = parser.parse(xmlString) as XmlNode;
  const comprobante = firstNode(result['Comprobante']);

  if (!comprobante) {
    throw new AppError(responses.SalesNote.invalidXml, 400);
  }

  const complemento = firstNode(comprobante['Complemento']);
  const timbre = firstNode(complemento?.['TimbreFiscalDigital']);

  if (!timbre) {
    throw new AppError(responses.SalesNote.xmlWithoutStamp, 400);
  }

  const uuid = asText(timbre['@_UUID']);
  const satStamp = asText(timbre['@_SelloSAT']);
  const issuerStamp = asText(timbre['@_SelloCFD']);
  const stampedAt = asText(timbre['@_FechaTimbrado']);
  const rfcProvCertif = asText(timbre['@_RfcProvCertif']);
  const noCertificadoSAT = asText(timbre['@_NoCertificadoSAT']);
  const version = asText(timbre['@_Version']) || '1.1';

  const emisor = firstNode(comprobante['Emisor']);
  const receptor = firstNode(comprobante['Receptor']);

  const emisorRfc = asText(emisor?.['@_Rfc']);
  const receptorRfc = asText(receptor?.['@_Rfc']);
  const total = asText(comprobante['@_Total']);

  if (!uuid || !satStamp || !issuerStamp || !stampedAt) {
    throw new AppError(responses.SalesNote.incompleteXml, 400);
  }

  return {
    uuid,
    rfc: receptorRfc || null,
    satStamp,
    issuerStamp,
    originalString: buildOriginalString(
      version,
      uuid,
      stampedAt,
      rfcProvCertif,
      issuerStamp,
      noCertificadoSAT
    ),
    stampedAt,
    qrString: buildQrString(
      uuid,
      emisorRfc,
      receptorRfc,
      total,
      issuerStamp
    ),
  };
}

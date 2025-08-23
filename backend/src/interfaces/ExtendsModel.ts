import { Document } from 'mongoose';
import {
   UserInt,
   ProductInt,
   InvoiceInt,
   InviteInt,
} from '@cmm_interfaces/index';

/* ------------------ Code ------------------ */

export interface UserDocument extends UserInt, Document {}
export interface ProductDocument extends ProductInt, Document {}
export interface InvoiceDocument extends InvoiceInt, Document {}
export interface InviteDocument extends InviteInt, Document {}

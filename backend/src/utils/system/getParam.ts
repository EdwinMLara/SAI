import AppError from './AppError';
import responses from './responses';

/* ------------------ Code ------------------ */

function getParam(entryParam: any): string {
   const param = entryParam as string;
   if (!param) throw new AppError(responses.System.missingFieldBody, 500);
   return param;
}

export default getParam;

import responses from '@utils/system/responses';
import AppError from '@utils/system/AppError';

/* ------------------ Code ------------------ */

/**
 * Retrieves and validates a param parameter, ensuring it is a non-empty string.
 * Throws an AppError if the parameter is invalid or empty.
 *
 * @param query - The value received as a param parameter (can be string or null)
 * @returns The param string if valid
 * @throws AppError if the parameter is invalid or empty
 */
function getParam(query: any | null) {
   if (typeof query === 'string' && query.trim() !== '') return query;
   throw new AppError(responses.System.missingFieldBody);
}

export default getParam;

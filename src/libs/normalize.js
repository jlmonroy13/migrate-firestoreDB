import { normalize as _normalize } from 'normalizr';
import { has } from 'ramda';

export default function normalize(response, transformSchema) {
  const { status } = response;
  if (has('errors', response)) return response;
  if (status !== undefined || status > 300) return response;
  return _normalize(response, transformSchema);
}

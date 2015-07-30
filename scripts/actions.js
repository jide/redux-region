import { UPDATE_REGION } from './constants';

export function set(payload) {
  return {
    type: UPDATE_REGION,
    ...payload
  };
}

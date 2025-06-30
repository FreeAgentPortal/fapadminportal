import { useInterfaceStore } from '@/state/interface';
import { logout } from '../state/auth'; 

/**
 * @description - This function is used to handle errors in the client application.
 *
 * @param {Error} error - The error object
 * @Author - Austin Howard
 * @lastModified - 2022-07-22
 * @modifiedBy - Austin Howard
 * @version - 1.0.0
 */
export default (error: any) => {
  // const { addAlert } = useInterfaceStore((state: any) => state);
  const messageTxt = error.response && error.response.data.message ? error.response.data.message : error.message;
  if (messageTxt === 'Not authorized, token failed') {
    // logout();
  }
  // return addAlert({ message: messageTxt, type: 'error' }); 
};

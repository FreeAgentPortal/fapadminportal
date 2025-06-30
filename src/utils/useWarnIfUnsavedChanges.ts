import Router from 'next/router';
import { useEffect } from 'react';

export const useWarnIfUnsavedChanges = (
  unsaved: boolean,
  callback: () => boolean
) => {
  useEffect(() => {
    if (unsaved) {
      const routeChangeStart = () => {
        const ok = callback();
        if (!ok) {
          Router.events.emit('routeChangeError');
          throw 'Abort route change. Please ignore this error.';
        }
      };
      Router.events.on('routeChangeStart', routeChangeStart);

      return () => {
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
  }, [unsaved]);
};

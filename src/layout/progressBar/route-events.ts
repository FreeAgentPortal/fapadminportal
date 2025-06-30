'use client';
import Router from 'next/router';

export function onRouteChange(start: () => void, done: () => void) {
 Router.events.on('routeChangeError', () => {
    console.log(`routeChangestart`)
  });
  Router.events.on('routeChangeStart', start);
  Router.events.on('routeChangeComplete', done);
  Router.events.on('routeChangeError', done);

  return () => {
    Router.events.off('routeChangeStart', start);
    Router.events.off('routeChangeComplete', done);
    Router.events.off('routeChangeError', done);
  };
}

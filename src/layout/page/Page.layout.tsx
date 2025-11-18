'use client';
import React, { Suspense } from 'react';
import BlockedMessage from '@/components/blockedMessage/BlockedMessage.component';
import { useUser } from '@/state/auth';
import { hasFeature } from '@/utils/hasFeature';
import Auth from '@/views/auth/Auth.view';
import { ReactNode } from 'react';
import { AiFillControl } from 'react-icons/ai';
import Control from '../control/Control.layout';
import Header from '../header/Header.layout';
import SideBar from '../sideBar/SideBar.layout';
import styles from './Page.module.scss';
import NextTopLoader from 'nextjs-toploader';
import { useLayoutStore } from '@/state/layout';
import AlertCenter from '../alertCenter/AlertCenter.layout';
import { LoaderProvider } from '../progressBar/LoaderProvider.component';
import { Skeleton } from 'antd';
import { useControlNav } from '@/providers/ControlNavProvider';

//make a type with children as a prop
type Props = {
  children: React.ReactNode;
  pages?: Array<{ title: string; link?: string; icon?: ReactNode; onClick?: () => void }>;
  smallSideBar?: boolean; // Changed from largeSideBar to smallSideBar
  backgroundColor?: string;
  neededFeature?: any;
  enableBlockCheck?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    url?: string;
    image?: string;
  };
  sidebarHidden?: boolean;
  loading?: boolean;
};
const PageLayout = (props: Props) => {
  const mobileSideBarOpen = useLayoutStore((state) => state.mobileSideBarOpen);
  const setMobileSideBarOpen = useLayoutStore((state) => state.setMobileSideBarOpen);
  const sidebarCollapsed = useLayoutStore((state) => state.sidebarCollapsed);
  const controlLayoutOpen = useLayoutStore((state) => state.controlLayoutOpen);
  const controlLayoutCollapsed = useLayoutStore((state) => state.controlLayoutCollapsed);
  const toggleControlLayout = useLayoutStore((state) => state.toggleControlLayout);

  // Get control navigation from context
  const { controlNav, hideControlLayout } = useControlNav();

  const { data: loggedInData } = useUser();
  const getPageBlockData: () => boolean | 'blacklist' | 'feature' | 'verification' = () => {
    if (!props.enableBlockCheck) return false;

    if (!loggedInData?.isEmailVerified) {
      return 'verification';
    }

    // if (props.neededFeature) {
    //   if (!hasFeature(loggedInData, props.neededFeature)) {
    //     return 'feature';
    //   }
    // }

    return false as boolean;
  };

  return (
    <div
      className={`${styles.container} ${
        props.smallSideBar || sidebarCollapsed ? styles.small : ''
      }`}
    >
      {loggedInData ? (
        <>
          <Header pages={props.pages} onMobileMenuClick={() => setMobileSideBarOpen(true)} />
          {!props.sidebarHidden && (
            <div className={styles.sideBar}>
              {props?.pages && (
                <SideBar
                  page={props.pages[0]}
                  small={props.smallSideBar}
                  isMobileOpen={mobileSideBarOpen}
                  onMobileClose={() => setMobileSideBarOpen(false)}
                />
              )}
            </div>
          )}
          <div
            className={`${styles.content} ${
              controlLayoutOpen && !getPageBlockData() && styles.controlContainerActive
            } ${
              controlNav && !getPageBlockData() && !hideControlLayout && styles.controlBarActive
            } ${controlLayoutCollapsed && !getPageBlockData() && styles.controlBarCollapsed}`}
            style={{
              backgroundColor: props.backgroundColor,
            }}
          >
            {controlNav && !getPageBlockData() && !hideControlLayout && (
              <>
                <div className={styles.controlContainer}>
                  <Control navigation={controlNav} />
                </div>

                <div className={styles.controlToggleBtn} onClick={() => toggleControlLayout()}>
                  <AiFillControl />
                </div>
              </>
            )}

            <div className={styles.childrenWrapper}>
              <AlertCenter />
              <div className={styles.childrenContainer}>
                {getPageBlockData() ? (
                  <BlockedMessage
                    neededFeature={props.neededFeature}
                    type={getPageBlockData() as any}
                  />
                ) : (
                  <>
                    <NextTopLoader
                      color="var(--primary)"
                      initialPosition={0.08}
                      crawlSpeed={200}
                      height={3}
                      crawl={true}
                      showSpinner={false}
                      easing="ease"
                      speed={200}
                      shadow="0 0 10px var(--primary-dark),0 0 5px var(--primary)"
                      showForHashAnchor
                    />
                    <LoaderProvider>
                      {props.loading ? <Skeleton active /> : props.children}
                    </LoaderProvider>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Suspense>
          <Auth />
        </Suspense>
      )}
    </div>
  );
};
export default PageLayout;

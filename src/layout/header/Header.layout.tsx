import styles from './Header.module.scss';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Avatar, Breadcrumb, Tooltip, Dropdown } from 'antd';
import Link from 'next/link';
import { useUser, logout } from '@/state/auth';
import { BiLogOutCircle } from 'react-icons/bi';
import { ReactNode } from 'react';
import Notifications from './components/Notifications.component';
import { useLayoutStore } from '@/state/layout';

type Props = {
  pages?: Array<{ title: string; link?: string; icon?: ReactNode }>;
};

const Header = (props: Props) => {
  const toggleSideBar = useLayoutStore((state) => state.toggleSideBar);
  const { data: loggedInData } = useUser();
  const profiles = Object.keys(loggedInData?.profileRefs || {});

  const profileItems = profiles.map((p) => ({
    key: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
    onClick: () => {
      if (p === 'athlete') return;
      const urls: Record<string, string | undefined> = {
        team: process.env.TEAMS_APP_URL,
        admin: process.env.ADMIN_APP_URL,
        scout: process.env.SCOUT_APP_URL,
      };
      const url = urls[p];
      if (url) window.open(`${url}/?token=${loggedInData?.token}`);
    },
  }));
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <div
          className={styles.hamburger}
          onClick={() => {
            toggleSideBar();
          }}
        >
          <RxHamburgerMenu />
        </div>

        <Breadcrumb
          className={styles.breadcrumb}
          itemRender={(route, params, routes, paths) => {
            const last = routes.indexOf(route) === routes.length - 1;

            return last ? (
              <span>{route.title}</span>
            ) : (
              <Link href={route.path as string} className={`${routes[routes.length - 1].title === route.title && styles.active}`}>
                {route.title}
              </Link>
            );
          }}
          items={
            props.pages?.map((page) => {
              return {
                title: page?.title,
                path: page?.link || '',
                element: <Link href={page?.link || ''}>{page?.title}</Link>,
              };
            }) as any[]
          }
        />
      </div>

      <div className={styles.headerRight}>
        <div className={styles.headerRight}>
          <div className={styles.userContainer}>
            <div className={styles.user}>
              <div className={styles.userInfo}>
                <p>{loggedInData?.fullName}</p>
              </div>
              <Avatar src={loggedInData?.profileImageUrl ?? '/images/no-photo.png'} className={styles.avatar} />
            </div>
            {profiles.length > 1 ? (
              <Dropdown menu={{ items: profileItems }}>
                <span className={styles.profileButton}>Profiles</span>
              </Dropdown>
            ) : profiles.length === 1 ? (
              <span className={styles.profileButton}>{profileItems[0]?.label}</span>
            ) : null}
            <Notifications />
            <Tooltip title="Logout">
              <span
                onClick={() => {
                  logout(true);
                }}
              >
                <BiLogOutCircle className={styles.logoutIcon} />
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

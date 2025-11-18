import styles from './Header.module.scss';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Avatar, Breadcrumb, Tooltip } from 'antd';
import Link from 'next/link';
import { useUser, logout } from '@/state/auth';
import { BiLogOutCircle } from 'react-icons/bi';
import { ReactNode } from 'react';
import Notifications from './components/Notifications.component';

type Props = {
  pages?: Array<{ title: string; link?: string; icon?: ReactNode }>;
  onMobileMenuClick?: () => void;
};

const Header = (props: Props) => {
  const { data: loggedInData } = useUser();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.hamburger}
          onClick={props.onMobileMenuClick}
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu />
        </button>

        <Breadcrumb
          className={styles.breadcrumb}
          itemRender={(route, params, routes) => {
            const isLast = routes.indexOf(route) === routes.length - 1;

            return isLast ? (
              <span className={styles.breadcrumbActive}>{route.title}</span>
            ) : (
              <Link href={route.path as string} className={styles.breadcrumbLink}>
                {route.title}
              </Link>
            );
          }}
          items={props.pages?.map((page) => ({
            title: page.title,
            path: page.link || '',
          }))}
        />
      </div>

      <div className={styles.headerRight}>
        <Notifications />

        <div className={styles.userContainer}>
          <span className={styles.userName}>{loggedInData?.fullName}</span>
        </div>

        <Tooltip title="Logout">
          <button className={styles.logoutButton} onClick={() => logout()} aria-label="Logout">
            <BiLogOutCircle />
          </button>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;

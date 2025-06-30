import { useLayoutStore } from "@/state/ui/layout";
import styles from "./Header.module.scss";
import { RxHamburgerMenu } from "react-icons/rx";
import { Avatar, Breadcrumb, Tooltip } from "antd";
import Link from "next/link";
import { useUser, logout } from "@/state/auth";
import { BiLogOutCircle } from "react-icons/bi";
import { ReactNode } from "react";
import Notifications from "./components/Notifications.component"; 
import useApiHook from "@/state/useApi";
type Props = {
  pages?: Array<{ title: string; link?: string; icon?: ReactNode }>;
};

const Header = (props: Props) => {
  const toggleSideBar = useLayoutStore((state) => state.toggleSideBar);
  const { data: loggedInData } = useUser();
  const { data: selectedProfile } = useApiHook({
    url: `/ministry/${loggedInData.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInData?.user?.ministry?._id,
    method: "GET",
  }) as any;
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
              <Link
                href={route.path as string}
                className={`${routes[routes.length - 1].title === route.title && styles.active}`}
              >
                {route.title}
              </Link>
            );
          }}
          items={
            props.pages?.map((page) => {
              return {
                title: page?.title,
                path: page?.link || "",

                // element: <Link href={page?.link || ""}>{page?.title}</Link>,
              };
            }) as any[]
          }
        />
      </div>

      <div className={styles.headerRight}>
        <div className={styles.headerRight}>
          <div className={styles.userContainer}>
            <div className={styles.user}>
              <Avatar src={loggedInData?.user?.profileImageUrl} className={styles.avatar} />
              <div className={styles.userInfo}>
                <h1>{selectedProfile?.ministry?.name} </h1>
                <p>
                  {loggedInData?.user?.firstName} {loggedInData?.user?.lastName}
                </p>
              </div>
            </div>
            <Notifications />
            <Tooltip title="Logout">
              <span
                onClick={() => {
                  logout();
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

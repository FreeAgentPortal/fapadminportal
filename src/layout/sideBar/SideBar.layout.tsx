import React from "react";
import styles from "./SideBar.module.scss";
import { navigation } from "@/data/navigation";
import { Button } from "antd";
import Link from "next/link";
import Image from "next/image";
import { RxHamburgerMenu } from "react-icons/rx";
import { useUser } from "@/state/auth";
import { useLayoutStore } from "@/state/layout";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader/Loader.component";
import useApiHook from "@/hooks/useApi";

//make a type with children as a prop
type Props = {
  page: { title: string };
  large?: boolean;
};
const SideBar = (props: Props) => {
  // Use reactive query instead of static queryClient.getQueryData
  const { data: profileData } = useQuery({
    queryKey: ["profile", "admin"],
    enabled: false, // Don't auto-fetch, assume it's being fetched elsewhere
    staleTime: Infinity, // Use cached data if available
  });

  const { data: claimsData } = useApiHook({
    url: "/auth/claim",
    key: ["claims", "pending"],
    method: "GET",
    filter: `status;pending`,
  }) as { data: { payload: any[]; metadata: any } };

  const sideBarOpen = useLayoutStore((state) => state.sideBarOpen);
  const toggleSideBar = useLayoutStore((state) => state.toggleSideBar);

  // Extract profile from the query data
  const profile = profileData as { payload: any } | undefined;

  return (
    <div className={`${styles.container} ${props.large ? "" : styles.small}`}>
      <div className={styles.logoContainer}>
        {sideBarOpen && (
          <div
            className={styles.hamburger}
            onClick={() => {
              toggleSideBar();
            }}
          >
            <RxHamburgerMenu />
          </div>
        )}
        {/* <Image
          src="/images/logo.png"
          width={30}
          height={50}
          className={styles.logo + " " + styles.saltLogo}
          style={{
            objectFit: "contain",
          }}
          alt="logo"
        /> */}

        <Image
          src={"/images/logo.png"}
          width={75}
          height={50}
          className={styles.logo}
          style={{
            objectFit: "contain",
          }}
          alt="logo"
        />
        <p className={`${styles.productName}`}>{process.env.SERVICE_NAME || "FAP - Admin"}</p>
      </div>

      {Object.values(
        navigation({
          user: profile?.payload,
          claimsCount: claimsData?.metadata?.totalCount || 0,
        })
      )
        .filter((i: any) => !i.hidden)
        .map((item: any) => {
          return (
            <div key={item.title} className={`${styles.group}`}>
              <h2 className={styles.header}>{item.title}</h2>
              <div className={styles.links}>
                {item.links &&
                  Object.values(item.links)
                    .filter((i: any) => !i.hidden)
                    .map((subItem: any, indx: number) => {
                      return (
                        <Link
                          key={indx + subItem.title}
                          href={subItem.link}
                          className={`${styles.link} ${props.page.title === subItem.title && styles.active} ${
                            subItem.pulse && styles.pulse
                          }`}
                          onClick={() => toggleSideBar()}
                        >
                          <span className={styles.icon}>{subItem.icon}</span>
                          <span className={styles.text}>{subItem.title}</span>
                        </Link>
                      );
                    })}
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default SideBar;

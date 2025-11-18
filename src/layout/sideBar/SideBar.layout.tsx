import styles from "./SideBar.module.scss";
import { navigation } from "@/data/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/state/auth";
import { useLayoutStore } from "@/state/layout";
import { Drawer, Button, Tooltip } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import useApiHook from "@/hooks/useApi";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

//make a type with children as a prop
type Props = {
  page: { title: string };
  small?: boolean; // Changed from large to small
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

const SideBar = (props: Props) => {
  const { selectedProfile } = useSelectedProfile();

  const { data: claimsData } = useApiHook({
    url: "/auth/claim",
    key: ["claims", "pending"],
    method: "GET",
    filter: `status;pending`,
  }) as { data: { payload: any[]; metadata: any } };

  const { data: scoutReportData } = useApiHook({
    url: "/scout",
    key: ["scout_reports", "pending"],
    method: "GET",
    filter: `isDraft;false|isFinalized;false`, // only fetch reports that are ready for review
  }) as { data: { payload: any[]; metadata: any } };
  const sidebarCollapsed = useLayoutStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useLayoutStore((state) => state.toggleSidebarCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarContent = (
    <div className={`${styles.container} ${!isMobile && (props.small || sidebarCollapsed) ? styles.small : ""}`}>
      {!isMobile && (
        <Button
          type="text"
          icon={sidebarCollapsed ? <RightOutlined /> : <LeftOutlined />}
          onClick={toggleSidebarCollapsed}
          className={styles.collapseButton}
        />
      )}

      {/* Fixed Header */}
      <div className={styles.headerSection}>
        <div className={styles.logoContainer}>
          <Image
            src="/images/logo.png"
            width={sidebarCollapsed ? 50 : 100}
            height={100}
            className={styles.logo}
            style={{
              objectFit: "contain",
            }}
            alt="logo"
          />

          <div>
            <p className={`${styles.productName}`}>FreeAgent — Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className={styles.mainContent}>
        {Object.values(
          navigation({
            user: selectedProfile,
            claimsCount: claimsData?.metadata?.totalCount || 0,
            scoutReportsCount: scoutReportData?.metadata?.totalCount || 0,
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
                            onClick={() => {
                              if (isMobile && props.onMobileClose) {
                                props.onMobileClose();
                              }
                            }}
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

      {/* Fixed Footer */}
      <div className={styles.footerSection}>
        <p className={styles.fapText}>FreeAgentPortal</p>
        <p className={styles.versionText}>v{process.env.VERSION}</p>
      </div>
    </div>
  );

  // On mobile, render in Drawer
  if (isMobile) {
    return (
      <Drawer
        placement="left"
        onClose={props.onMobileClose}
        open={props.isMobileOpen}
        width={265}
        styles={{
          body: { padding: 0 },
          header: { display: "none" },
        }}
        className={styles.mobileDrawer}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // On desktop, render normally
  return sidebarContent;
};
export default SideBar;

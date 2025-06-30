import styles from "./Control.module.scss";
import { useState } from "react";
import { ControlNavItem } from "@/types/navigation";
import { Tooltip } from "antd";

type Props = {
  navigation: Array<ControlNavItem>;
};

const Control = (props: Props) => {
  const [currentControlPage, setCurrentControlPage] = useState<ControlNavItem>(props.navigation[0]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {currentControlPage.title && (
          <div className={styles.header}>
            <h1 className={styles.title}>{currentControlPage.title}</h1>
          </div>
        )}
        <div className={styles.children}>{currentControlPage.children}</div>
      </div>

      <div className={styles.navigationContainer}>
        {props.navigation
          .filter((i) => !i.hideIf)
          .map((item, index) => {
            return (
              <Tooltip title={item.title} placement="right" key={index + item.title}>
                <div
                  key={index}
                  className={`${styles.navigationItem} ${currentControlPage.title === item.title && styles.active}`}
                  onClick={() => setCurrentControlPage(item)}
                >
                  <div className={styles.icon}>{item.icon}</div>
                </div>
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
};

export default Control;

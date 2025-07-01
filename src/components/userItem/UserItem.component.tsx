import User from "@/types/User";
import React from "react";
import styles from "./UserItem.module.scss";
import { Avatar } from "antd";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

interface Props {
  user: User;
  sm?: boolean;
}

const UserItem = ({ user, sm }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <Avatar
          src={user?.profileImageUrl ?? "/images/no-photo.png"}
          alt="user-profile-image"
          size={sm ? 48 : 64}
          className={styles.avatar}
        />
        <div className={styles.details}>
          <p className={styles.name}>{user?.fullName}</p>
          {!sm && <p className={styles.email}>{user?.email}</p>}
          {!sm && user?.phoneNumber && <p className={styles.phone}>{formatPhoneNumber(user.phoneNumber)}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserItem;

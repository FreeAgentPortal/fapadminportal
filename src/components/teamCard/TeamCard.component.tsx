import React from "react";
import styles from "./TeamCard.module.scss";
import { Button, Tag } from "antd";
import { ITeamType } from "@/types/ITeamType";
import Link from "next/link";
import { IoMdAdd, IoMdOpen } from "react-icons/io";
import Image from "next/image";

type Props = {
  team: ITeamType;
  isSubscribed?: boolean; // Optional prop to indicate if the user is isSubscribed to alerts for this team
  onSubscribe?: (teamId: string) => void; // Optional callback for subscription action
};

const TeamCard: React.FC<Props> = ({ team, isSubscribed, onSubscribe }) => {
  const primaryColor = team.color || "#4ba7d6"; // fallback to FAP default
  const altColor = team.alternateColor || "#ffffff";

  return (
    <div className={styles.card} style={{ borderColor: primaryColor, backgroundColor: altColor, color: primaryColor }}>
      <div className={styles.header}>
        {team.logos && team.logos.length > 0 && (
          <Image src={team.logos[0].href} alt={`${team.name} logo`} className={styles.logo} width={100} height={100} />
        )}
        <div>
          <h3>{team.name}</h3>
          {team.openToTryouts ? <Tag color="green">Open to Tryouts</Tag> : <Tag color="gray">Not Recruiting</Tag>}
        </div>
      </div>

      <div className={styles.meta}>
        <p>
          <strong>Coach:</strong> {team.coachName || "N/A"}
        </p>
        <p>
          <strong>State:</strong> {team?.location ?? "N/A"}
        </p>
      </div>
      <div className={styles.actions}>
        <Link href={`/team/${team.slug || team._id}`} className={styles.viewProfile}>
          <button disabled>
            <IoMdOpen />
          </button>
        </Link>
        {isSubscribed ? (
          <button className={styles.subscribedButton} onClick={() => onSubscribe && onSubscribe(team._id)}>
            ✔ Subscribed
          </button>
        ) : (
          <button className={styles.subscribeButton} onClick={() => onSubscribe && onSubscribe(team._id)}>
            <IoMdAdd className={styles.subscribeIcon} />
            <span className={styles.subscribeText}>Subscribe for alerts</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;

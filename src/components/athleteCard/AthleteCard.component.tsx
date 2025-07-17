import React from "react";
import styles from "./AthleteCard.module.scss";
import { IAthlete } from "@/types/IAthleteType";
import { Avatar, Tag, Tooltip, Rate } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  BookOutlined,
  RiseOutlined,
  StarOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  LinkOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { timeDifference } from "@/utils/timeDifference";
import { getPositionColor } from "./getPositionColor";

interface AthleteCardProps {
  athlete: IAthlete;
  sm?: boolean;
  onClick?: () => void;
}

const AthleteCard = ({ athlete, sm, onClick }: AthleteCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#52c41a";
    if (rating >= 3) return "#faad14";
    if (rating >= 2) return "#fa8c16";
    return "#ff4d4f";
  };

  const formatHeight = (heightString: string) => {
    if (!heightString) return null;
    return heightString;
  };

  const getGraduationStatus = (gradYear: any) => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(gradYear);

    if (year > currentYear) return { text: `Class of ${year}`, color: "#1890ff" };
    if (year === currentYear) return { text: "Current Senior", color: "#52c41a" };
    return { text: "Graduate", color: "#8c8c8c" };
  };

  return (
    <div className={`${styles.container} ${sm ? styles.compact : ""}`} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.athleteBasics}>
          <Avatar
            src={athlete?.profileImageUrl}
            icon={<UserOutlined />}
            size={sm ? 40 : 48}
            className={styles.avatar}
            style={{ backgroundColor: "#1890ff" }}
          />
          <div className={styles.nameSection}>
            <h3 className={styles.name}>{athlete?.fullName}</h3>
            <div className={styles.badges}>
              {athlete?.positions && athlete.positions.length > 0 && (
                <Tag color={getPositionColor(athlete.positions[0].name)} className={styles.positionTag}>
                  <RiseOutlined /> {athlete.positions[0].abbreviation || athlete.positions[0].name.toUpperCase()}
                </Tag>
              )}
              {athlete?.graduationYear && (
                <Tag color={getGraduationStatus(athlete.graduationYear).color} className={styles.gradTag}>
                  <CalendarOutlined /> {getGraduationStatus(athlete.graduationYear).text}
                </Tag>
              )}
            </div>
          </div>
        </div>

        {!sm && (
          <div className={styles.quickActions}>
            <Tooltip title="Athlete ID">
              <div className={styles.athleteId}>#{athlete?._id?.slice(-6)}</div>
            </Tooltip>
            {athlete?.diamondRating && (
              <div className={styles.ratingContainer}>
                <Rate
                  disabled
                  value={athlete.diamondRating}
                  style={{ fontSize: "12px", color: getRatingColor(athlete.diamondRating) }}
                />
                <span className={styles.ratingText}>{athlete.diamondRating}/5</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!sm && (
        <div className={styles.details}>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <MailOutlined className={styles.icon} />
              <span className={styles.text}>{athlete?.email}</span>
            </div>
            {athlete?.contactNumber && (
              <div className={styles.infoItem}>
                <PhoneOutlined className={styles.icon} />
                <span className={styles.text}>{formatPhoneNumber(athlete.contactNumber)}</span>
              </div>
            )}
            {athlete?.birthPlace && (
              <div className={styles.infoItem}>
                <EnvironmentOutlined className={styles.icon} />
                <span className={styles.text}>
                  {athlete.birthPlace.city}, {athlete.birthPlace.state}
                  {athlete.birthPlace.country !== "USA" && `, ${athlete.birthPlace.country}`}
                </span>
              </div>
            )}
          </div>

          <div className={styles.athleteStats}>
            {(athlete?.measurements || athlete?.metrics) && (
              <div className={styles.measurementsSection}>
                <span className={styles.sectionLabel}>Physical Stats:</span>
                <div className={styles.statTags}>
                  {athlete?.measurements &&
                    typeof athlete.measurements === "object" &&
                    Object.entries(athlete.measurements)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <Tag key={key} className={styles.statTag}>
                          {key}: {value}
                        </Tag>
                      ))}
                  {athlete?.metrics &&
                    typeof athlete.metrics === "object" &&
                    Object.entries(athlete.metrics)
                      .slice(0, 2)
                      .map(([key, value]) => (
                        <Tag key={key} className={styles.metricTag}>
                          {key}: {value}
                        </Tag>
                      ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.metadata}>
            <div className={styles.educationInfo}>
              {athlete?.college && (
                <div className={styles.metaItem}>
                  <BookOutlined className={styles.metaIcon} />
                  <span className={styles.metaText}>College: {athlete.college}</span>
                </div>
              )}
              {athlete?.highSchool && (
                <div className={styles.metaItem}>
                  <BookOutlined className={styles.metaIcon} />
                  <span className={styles.metaText}>High School: {athlete.highSchool}</span>
                </div>
              )}
              {athlete?.draft && (
                <div className={styles.metaItem}>
                  <TeamOutlined className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    Draft: {athlete.draft.year} - Round {athlete.draft.round}, Pick {athlete.draft.pick} (
                    {athlete.draft.team})
                  </span>
                </div>
              )}
              {athlete?.experienceYears && (
                <div className={styles.metaItem}>
                  <ClockCircleOutlined className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    {athlete.experienceYears} year{athlete.experienceYears !== 1 ? "s" : ""} experience
                  </span>
                </div>
              )}
            </div>

            {athlete?.awards && athlete.awards.length > 0 && (
              <div className={styles.awards}>
                <span className={styles.awardsLabel}>
                  <TrophyOutlined /> Awards:
                </span>
                <div className={styles.awardTags}>
                  {athlete.awards.slice(0, 2).map((award, index) => (
                    <Tag key={index} className={styles.awardTag}>
                      {award}
                    </Tag>
                  ))}
                  {athlete.awards.length > 2 && <Tag className={styles.moreTag}>+{athlete.awards.length - 2} more</Tag>}
                </div>
              </div>
            )}

            <div className={styles.additionalInfo}>
              {athlete?.highlightVideos && athlete.highlightVideos.length > 0 && (
                <div className={styles.highlights}>
                  <VideoCameraOutlined className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    {athlete.highlightVideos.length} highlight video{athlete.highlightVideos.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {athlete?.links && athlete.links.length > 0 && (
                <div className={styles.links}>
                  <LinkOutlined className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    {athlete.links.length} external link{athlete.links.length !== 1 ? "s" : ""} available
                  </span>
                </div>
              )}

              <div className={styles.metaItem}>
                <CalendarOutlined className={styles.metaIcon} />
                <span className={styles.metaText}>
                  Joined {timeDifference(new Date(), new Date(athlete?.createdAt))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteCard;

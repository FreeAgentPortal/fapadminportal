"use client";
import React, { useMemo } from "react";
import styles from "./AthleteCard.module.scss";
import { IAthlete } from "@/types/IAthleteType";
import { Avatar, Tag, Rate, Tooltip } from "antd";
import {
  UserOutlined,
  RiseOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  StarFilled,
} from "@ant-design/icons";
import { getPositionColor } from "./getPositionColor";
import { timeDifference } from "@/utils/timeDifference";

export type AthleteCardVariant = "default" | "compact";

interface AthleteCardV2Props {
  athlete: IAthlete;
  variant?: AthleteCardVariant; // default: 'default'
  onClick?: () => void; // open details page
  rightSlot?: React.ReactNode; // optional slot for row-level actions (e.g., kebab menu)
  className?: string;
}

/**
 * AthleteCardV2 – a compact, responsive, glanceable admin card.
 *
 * Design goals:
 *  - Default: Full information with chips, metadata, and rating details
 *  - Compact: Minimal surface area; name + rating only, smaller avatar
 *  - Mobile-first, grid-based layout
 *  - No local state; purely derived UI (functional, predictable)
 *  - Strict typography + line-clamp to avoid vertical growth
 */
export default function AthleteCard({
  athlete,
  variant = "default",
  onClick,
  rightSlot,
  className,
}: AthleteCardV2Props) {
  const primaryPosition = athlete?.positions?.[0];

  const grad = useMemo(() => {
    const yearRaw = (athlete as any)?.graduationYear;
    if (!yearRaw) return null;
    const currentYear = new Date().getFullYear();
    const year = parseInt(String(yearRaw), 10);
    if (Number.isNaN(year)) return null;
    if (year > currentYear) return { label: `Class of ${year}`, color: "#1677ff" };
    if (year === currentYear) return { label: "Senior", color: "#52c41a" };
    return { label: "Graduate", color: "#8c8c8c" };
  }, [athlete]);

  const rating = athlete?.diamondRating ?? 0;
  const ratingColor = rating >= 4 ? "#52c41a" : rating >= 3 ? "#faad14" : rating >= 2 ? "#fa8c16" : "#ff4d4f";

  return (
    <article
      className={[styles.card, variant === "compact" ? styles.compact : "", className || ""].join(" ")}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${athlete?.fullName || "Athlete"} – open details`}
    >
      {/* Row 1: Avatar • Name • quick chips • rating • actions */}
      <div className={styles.rowTop}>
        <Avatar
          src={athlete?.profileImageUrl || undefined}
          icon={<UserOutlined />}
          size={variant === "compact" ? 36 : 48}
          className={styles.avatar}
        />

        <div className={styles.main}>
          <div className={styles.nameLine}>
            <h3 className={styles.name} title={athlete?.fullName || "Unnamed"}>
              {athlete?.fullName || "Unnamed"}
            </h3>
            {variant === "default" && (
              <div className={styles.chips}>
                {typeof athlete?.isActive === "boolean" && (
                  <Tag
                    className={styles.chip}
                    color={athlete.isActive ? "green" : "red"}
                    icon={athlete.isActive ? <CheckCircleOutlined /> : <StopOutlined />}
                  >
                    {athlete.isActive ? "Active" : "Inactive"}
                  </Tag>
                )}
                {primaryPosition && (
                  <Tag className={styles.chip} color={getPositionColor(primaryPosition?.name)}>
                    <RiseOutlined /> {primaryPosition?.abbreviation || primaryPosition?.name?.toUpperCase()}
                  </Tag>
                )}
                {grad && (
                  <Tag className={styles.chip} color={grad.color}>
                    <CalendarOutlined /> {grad.label}
                  </Tag>
                )}
              </div>
            )}
          </div>

          {variant === "default" && (
            <div className={styles.metaLine}>
              {/* keep metadata terse; more is on the details page */}
              {athlete?.college && <span className={styles.meta}>{athlete.college}</span>}
              {athlete?.birthPlace?.state && <span className={styles.meta}>• {athlete.birthPlace.state}</span>}
              {athlete?.createdAt && (
                <span className={styles.meta}>• Joined {timeDifference(new Date(), new Date(athlete.createdAt))}</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.right}>
          {variant === "compact" ? (
            // Compact mode: only show rating number or essential info
            rating > 0 ? (
              <div className={styles.rating} style={{ color: ratingColor }}>
                <span className={styles.ratingText}>{rating.toFixed(1)}</span>
              </div>
            ) : (
              <div className={styles.ratingMuted}>NR</div>
            )
          ) : (
            // Default mode: full rating with star and tooltip
            <>
              {rating > 0 ? (
                <Tooltip title={`${rating}/5`}>
                  <div className={styles.rating} style={{ color: ratingColor }}>
                    <StarFilled className={styles.star} />
                    <span className={styles.ratingText}>{rating.toFixed(1)}</span>
                  </div>
                </Tooltip>
              ) : (
                <div className={styles.ratingMuted}>NR</div>
              )}
              {rightSlot && <div className={styles.actions}>{rightSlot}</div>}
            </>
          )}
        </div>
      </div>

      {/* Row 2: minimized star bar (only on default variant) */}
      {variant === "default" && rating > 0 && (
        <div className={styles.rowBottom}>
          <Rate disabled allowHalf value={rating} className={styles.rateSmall} />
        </div>
      )}
    </article>
  );
}

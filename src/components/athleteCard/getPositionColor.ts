/**
 * Returns the appropriate color code for a given football position
 * @param position - The player's position (case-insensitive)
 * @returns Hex color code for the position
 */
export const getPositionColor = (position: string): string => {
  switch (position?.toLowerCase()) {
    case "quarterback":
    case "qb":
      return "#f50";
    case "running back":
    case "rb":
      return "#52c41a";
    case "wide receiver":
    case "wr":
      return "#1890ff";
    case "tight end":
    case "te":
      return "#722ed1";
    case "offensive line":
    case "ol":
      return "#fa8c16";
    case "defensive line":
    case "dl":
      return "#eb2f96";
    case "linebacker":
    case "lb":
      return "#13c2c2";
    case "defensive back":
    case "db":
      return "#a0d911";
    case "safety":
      return "#fadb14";
    case "cornerback":
    case "cb":
      return "#722ed1";
    default:
      return "#8c8c8c";
  }
};

/**
 * Position color mapping for reference
 * Quarterback (QB) - Red (#f50)
 * Running Back (RB) - Green (#52c41a)
 * Wide Receiver (WR) - Blue (#1890ff)
 * Tight End (TE) - Purple (#722ed1)
 * Offensive Line (OL) - Orange (#fa8c16)
 * Defensive Line (DL) - Pink (#eb2f96)
 * Linebacker (LB) - Cyan (#13c2c2)
 * Defensive Back (DB) - Lime (#a0d911)
 * Safety - Yellow (#fadb14)
 * Cornerback (CB) - Purple (#722ed1)
 * Default - Gray (#8c8c8c)
 */

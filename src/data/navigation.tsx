import { RiHome2Fill } from "react-icons/ri";
import { MdSportsHandball, MdSupportAgent } from "react-icons/md";
import { FaClock, FaRegBell, FaStickyNote } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { BsBox, BsBroadcastPin } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoCodeSlashOutline } from "react-icons/io5";
import { RiAdminFill } from "react-icons/ri";
import { profile } from "console";
import { shouldHideForRoles, ROLE_GROUPS } from "@/utils/roleUtils";
import { Badge } from "antd";

export const navigation = (options?: any) => {
  return {
    home: {
      title: "Home",
      links: {
        home: {
          title: "Home",
          link: "/",
          icon: <RiHome2Fill />,
        },
        notifications: {
          title: "Notifications",
          link: "/notifications",
          icon: <FaRegBell />,
        },
      },
      hidden: false,
    },
    // management for athletes, teams, etc
    management: {
      title: "Management",
      links: {
        athletes: {
          title: "Athletes",
          link: "/athletes",
          icon: <MdSportsHandball />,
        },
        teams: {
          title: "Teams",
          link: "/teams",
          icon: <GiAmericanFootballHelmet />,
        },
        users: {
          title: "Users",
          link: "/users",
          icon: <BsFillPeopleFill />,
        },
        scout_reports: {
          title: "Scout Reports",
          link: "/scout_reports",
          icon: (
            <Badge count={options?.scoutReportsCount}>
              <BsBroadcastPin />
            </Badge>
          ),
        },
      },
      hidden: false,
    },
    account_details: {
      title: "Account Details",
      links: {
        support: {
          title: "Support",
          link: "/account_details/support",
          icon: <MdSupportAgent />,
        },
        account_details: {
          title: "Edit Account Settings",
          link: "/account_details",
          icon: <CgProfile />,
        },
      },
      hidden: false,
    },
    admin: {
      title: "Admin Tools",
      links: {
        claims: {
          title: "Profile Claims",
          link: "/admin/claims",
          icon: (
            <Badge count={options?.claimsCount}>
              <IoCodeSlashOutline />
            </Badge>
          ),
        },
        admin_profiles: {
          title: "Admin Profiles",
          link: "/admin/profiles/admin",
          icon: <RiAdminFill />,
        },
        scout_profiles: {
          title: "Scout Profiles",
          link: "/admin/profiles/scout",
          icon: <RiAdminFill />,
        },
        legal: {
          title: "Legal (Terms & Policy)",
          link: "/account_details/legal",
          icon: <FaStickyNote />,
        },
        plans: {
          title: "Plans & Billing",
          link: "/admin/plans",
          icon: <BsBox />,
        },
        support_admin: {
          title: `Support Admin`,
          link: "/account_details/support_admin",
          icon: <MdSupportAgent />,
        },
        schedulers: {
          title: "Schedulers",
          link: "/admin/schedulers",
          icon: (
            <Badge count={options?.schedulersCount}>
              <FaClock />
            </Badge>
          ),
          hidden: true,
        },
      },
      // Only show to users with admin or developer roles
      hidden: shouldHideForRoles(options?.user?.roles, ROLE_GROUPS.ADMIN_AND_DEV),
    },
    // error and 404 boundary, always hidden but something for the page layout to point to
    error_boundary: {
      title: "Error Boundary",
      links: {
        not_found: {
          title: "Not Found",
          link: "/404",
          icon: <BsBroadcastPin />,
        },
        error: {
          title: "Error",
          link: "/error",
          icon: <BsBroadcastPin />,
        },
      },
      hidden: true,
    },
  };
};

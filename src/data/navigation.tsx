import { RiHome2Fill } from "react-icons/ri";
import { MdSportsHandball, MdSupportAgent } from "react-icons/md";
import { FaRegBell, FaStickyNote } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { BsBox, BsBroadcastPin } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoCodeSlashOutline } from "react-icons/io5";
import { profile } from "console";
import { shouldHideForRoles, ROLE_GROUPS } from "@/utils/roleUtils";

export const navigation = (options?: any) => {
  console.log(options);
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
        }
      },
      hidden: false,
    },
    account_details: {
      title: "Account Details",
      links: {
        profile: {
          title: "Profile",
          link: "/account_details/profile",
          icon: <BsFillPeopleFill />,
        },
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
        legal: {
          title: "Legal (Terms & Policy)",
          link: "/account_details/legal",
          icon: <FaStickyNote />, 
        },
      },
      // Only show to users with admin or developer roles
      hidden: shouldHideForRoles(options?.user?.role, ROLE_GROUPS.ADMIN_AND_DEV),
    },
  };
};

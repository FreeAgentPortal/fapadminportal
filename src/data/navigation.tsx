import { RiHome2Fill } from "react-icons/ri";
import { MdSupportAgent } from "react-icons/md";
import { FaRegBell, FaStickyNote } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { BsBox, BsBroadcastPin } from "react-icons/bs";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoCodeSlashOutline } from "react-icons/io5";
import { profile } from "console";

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
      hidden: options?.user ? false : true,
    },
    account_details: {
      title: "Account Details",
      links: {
        profile: {
          title: "Profile",
          link: "/account_details/profile",
          icon: <BsFillPeopleFill />,
        },
        account_details: {
          title: "Edit Account Settings",
          link: "/account_details",
          icon: <CgProfile />,
        },
      },
      hidden: options?.user ? false : true,
    },
    admin: {
      title: "Admin Tools",
      links: {
        support: {
          title: "Support",
          link: "/account_details/support",
          icon: <MdSupportAgent />,
        },
        support_admin: {
          title: `Support Admin  `,
          link: "/account_details/support_admin",
          icon: <MdSupportAgent />,
          // check if the loggedInUser has a role "admin" in their role array
          hidden: /admin|developer/.test(options?.user?.role) ? true : false,
        },
        legal: {
          title: "Legal (Terms & Policy)",
          link: "/account_details/legal",
          icon: <FaStickyNote />,
        },
      },
      hidden: options?.user ? false : true,
    },
  };
};

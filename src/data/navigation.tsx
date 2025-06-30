import { RiHome2Fill } from 'react-icons/ri';
import { MdSupportAgent } from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { BsBox, BsBroadcastPin } from 'react-icons/bs';
import { BsFillPeopleFill } from 'react-icons/bs';
import { IoCodeSlashOutline } from 'react-icons/io5';
import { profile } from 'console';

export const navigation = (options?: any) => {
  return {
    home: {
      title: 'Home',
      links: {
        home: {
          title: 'Home',
          link: '/',
          icon: <RiHome2Fill />,
        },
        feed: {
          title: 'Feed',
          link: '/feed',
          icon: <BsBroadcastPin />,
        },
        notifications: {
          title: 'Notifications',
          link: '/notifications',
          icon: <FaRegBell />,
        },
      },
      hidden: options?.user ? false : true,
    },
    opportunities_hub: {
      title: 'Opportunities Hub',
      links: {
        team_finder: {
          title: 'Team Finder',
          link: '/team-finder',
          icon: <BsFillPeopleFill />,
        },
      },
      hidden: true,
    },
    account_details: {
      title: 'Account Details',
      links: {
        profile: {
          title: 'Profile',
          link: '/account_details/profile',
          icon: <BsFillPeopleFill />,
        },
        account_details: {
          title: 'Edit Account Settings',
          link: '/account_details',
          icon: <CgProfile />,
        },
        keys: {
          title: 'API Keys',
          link: '/account_details/keys',
          icon: <IoCodeSlashOutline />,
        },
        support: {
          title: 'Support',
          link: '/account_details/support',
          icon: <MdSupportAgent />,
        },
      },
      hidden: options?.user ? false : true,
    },

    billing: {
      title: 'Billing',
      links: {
        account_center: {
          title: 'Billing Account Center',
          link: '/billing',
          icon: <BsBox />,
        },
      },
      hidden: options?.user ? false : true,
    },
    auth: {
      title: 'Auth',
      links: {
        login: {
          title: 'Login',
          link: '/auth/login',
          icon: <CgProfile />,
          hidden: false,
        },
        register: {
          title: 'Register',
          link: '/auth/register',
          icon: <CgProfile />,
        },
        forgot_password: {
          title: 'Forgot Password',
          link: '/auth/forgotpassword',
          icon: <CgProfile />,
        },
        reset_password: {
          title: 'Reset Password',
          link: '/auth/resetpassword',
          icon: <CgProfile />,
        },
      },
      hidden: options?.user ? true : false,
    },
  };
};

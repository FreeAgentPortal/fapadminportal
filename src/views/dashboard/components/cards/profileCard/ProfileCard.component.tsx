import React from 'react';
import StepIndicator, { Step } from '@/components/stepIndicator/StepIndicator.component';
import styles from './ProfileCard.module.scss';
import { IAthlete } from '@/types/IAthleteType';
import { Button } from 'antd';
import { IoOpenOutline } from 'react-icons/io5';
import Link from 'next/link';

interface Props {
  profile: IAthlete | null;
}

const ProfileCard = ({ profile }: Props) => {
  const steps: Step[] = [
    {
      key: 'measurements',
      label: 'Measurements',
      description: 'Provide your measurements to help scouts evaluate you.',
      isComplete: profile?.measurements instanceof Map ? profile.measurements.size > 0 : !!profile?.measurements && Object.keys(profile.measurements).length > 0,
    },
    {
      key: 'statistics',
      label: 'Statistics',
      description: 'Upload your latest statistics.',
      isComplete: profile?.metrics instanceof Map ? profile.metrics.size > 0 : !!profile?.metrics && Object.keys(profile.metrics).length > 0,
    },
    {
      key: 'videos',
      label: 'Highlight Videos',
      description: 'Upload game film to showcase your skills.',
      isComplete: (profile?.highlightVideos?.length ?? 0) > 0,
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Finish setting up your profile!</h2>
        <Link href="/account_details/profile" passHref>
          <Button type="primary">
            <IoOpenOutline />
          </Button>
        </Link>
      </div>
      <StepIndicator steps={steps} />
    </div>
  );
};
export default ProfileCard;

'use client';
import React from 'react';
import styles from './Profile.module.scss';
import { Tabs, TabsProps } from 'antd';
import BasicInfo from './subViews/basicInfo/BasicInfo.component';
import Background from './subViews/background/Background.component';
import SharedProfileManager from './sharedProfileManager/SharedProfileManager.layout';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;

  const validateUrl = (value: string) => /^https:\/\/.+/.test(value);
  const { mutate: handleSubmit } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,athlete'],
    successMessage: 'Profile updated successfully',
  }) as any;
  const tabs: TabsProps['items'] = [
    {
      label: 'Info',
      key: '1',
      children: <BasicInfo />,
    },
    {
      label: 'Measurements',
      key: '2',
      children: (
        <SharedProfileManager
          title="Measurements"
          mode="map"
          data={profile.payload.measurements}
          allowedItems={[
            { key: 'height', label: 'Height', unit: 'inches' },
            { key: 'weight', label: 'Weight', unit: 'lbs' },
            { key: 'armLength', label: 'Arm Length', unit: 'inches' },
            { key: 'handSize', label: 'Hand Size', unit: 'inches' },
            { key: 'wingspan', label: 'Wingspan', unit: 'inches' },
            { key: 'neckSize', label: 'Neck Size', unit: 'inches' },
            { key: 'chestSize', label: 'Chest Size', unit: 'inches' },
            { key: 'thighCircumference', label: 'Thigh Circumference', unit: 'inches' },
            { key: 'calfCircumference', label: 'Calf Circumference', unit: 'inches' },
            // Body Composition
            { key: 'bodyFatPercentage', label: 'Body Fat %', unit: '%' },
            { key: 'bmi', label: 'BMI', unit: 'score' },
          ]}
          onSave={(updated) => {
            handleSubmit({
              url: `/athlete/${profile.payload._id}`,
              formData: { ...profile.payload, measurements: updated },
            });
          }}
        />
      ),
    },
    {
      label: 'Performance Metrics',
      key: '3',
      children: (
        <SharedProfileManager
          title="Metrics"
          mode="map"
          data={profile.payload.metrics}
          allowedItems={[
            // Combine Drills
            { key: 'fortyYardDash', label: '40 Yard Dash', unit: 'seconds' },
            { key: 'tenYardSplit', label: '10 Yard Split', unit: 'seconds' },
            { key: 'twentyYardShuttle', label: '20 Yard Shuttle', unit: 'seconds' },
            { key: 'threeConeDrill', label: '3 Cone Drill', unit: 'seconds' },
            { key: 'verticalJump', label: 'Vertical Jump', unit: 'inches' },
            { key: 'broadJump', label: 'Broad Jump', unit: 'inches' },
            { key: 'benchPressReps', label: 'Bench Press Reps', unit: 'reps' },

            // Strength & Power
            { key: 'maxBench', label: 'Max Bench', unit: 'lbs' },
            { key: 'maxSquat', label: 'Max Squat', unit: 'lbs' },
            { key: 'maxPowerClean', label: 'Max Power Clean', unit: 'lbs' },
            { key: 'gripStrength', label: 'Grip Strength', unit: 'lbs' },

            // Speed & Agility
            { key: 'sprintSpeed', label: 'Sprint Speed', unit: 'mph' },
            { key: 'topEndSpeed', label: 'Top End Speed', unit: 'mph' },
            { key: 'shuttleAgility', label: 'Shuttle Agility Rating', unit: 'score' },
            { key: 'explosivenessScore', label: 'Explosiveness Score', unit: 'score' },
          ]}
          onSave={(updated) => {
            handleSubmit({
              url: `/athlete/${profile.payload._id}`,
              formData: { ...profile.payload, metrics: updated },
            });
          }}
        />
      ),
    },
    {
      label: 'Background',
      key: '4',
      children: <Background />,
    },
    {
      label: 'Media',
      key: '5',
      children: (
        <SharedProfileManager
          title="Highlight Videos"
          mode="list"
          data={profile.payload.highlightVideos}
          validateItem={validateUrl}
          onSave={(updated) => {
            handleSubmit({
              url: `/athlete/${profile.payload._id}`,
              formData: { ...profile.payload, highlightVideos: updated },
            });
          }}
        />
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" type="card" items={tabs} animated />
    </div>
  );
};

export default Profile;

'use client';
import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Checkbox, Button, message } from 'antd';
import type { FormProps } from 'antd';
import { EventDocument } from '@/types/IEventType';
import { formatDate, formatTime } from '../../utils/eventCardHelpers';
import styles from './RegistrationModal.module.scss';
import useApiHook from '@/hooks/useApi';
import { useInterfaceStore } from '@/state/interface';
import { useSelectedProfile } from '@/hooks/useSelectedProfile';

interface RegistrationModalProps {
  event: EventDocument;
  open: boolean;
  onClose: () => void;
}

interface RegistrationFormData {
  [key: string]: any;
}

const RegistrationModal = ({ event, open, onClose }: RegistrationModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: registerForEvent } = useApiHook({
    method: 'POST',
    key: 'event.register',
  }) as any;
  const { selectedProfile } = useSelectedProfile();

  const { addAlert } = useInterfaceStore((state) => state);
  const handleSubmit: FormProps<RegistrationFormData>['onFinish'] = async (values) => {
    setIsSubmitting(true);
    try {
      // Format answers into array of objects with key, label, and answer
      const answers =
        event.registration?.questions?.map((question) => ({
          key: question.key,
          label: question.label,
          answer: values[question.key],
        })) || [];

      registerForEvent(
        {
          url: `/feed/event/${event._id}/registration`,
          formData: {
            answers,
            profileType: 'athlete',
            profileId: selectedProfile?._id,
          },
        },
        {
          onSuccess: () => {
            addAlert({ message: 'Successfully registered for the event!', type: 'success' });
            form.resetFields();
            onClose();
          },
        }
      );
    } catch (error) {
      addAlert({ message: 'Failed to register for event. Please try again.', type: 'error' });
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal title="Event Registration" open={open} onCancel={handleCancel} footer={null} width={600} className={styles.modal}>
      <div className={styles.eventSummary}>
        <h3>{event.title}</h3>
        <div className={styles.eventDetails}>
          <p>
            <strong>Date:</strong> {formatDate(event.startsAt)}
          </p>
          <p>
            <strong>Time:</strong> {formatTime(event.startsAt)}
          </p>
          {event.location.kind === 'physical' && event.location.physical?.venueName && (
            <p>
              <strong>Location:</strong> {event.location.physical.venueName}
            </p>
          )}
          {event.registration?.price && (
            <p>
              <strong>Price:</strong> ${event.registration.price} {event.registration.currency || 'USD'}
            </p>
          )}
          {event.registration?.capacity && (
            <p>
              <strong>Capacity:</strong> {event.registration.capacity} participants
            </p>
          )}
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
        {/* Render dynamic registration questions */}
        {event.registration?.questions?.map((question) => {
          switch (question.type) {
            case 'shortText':
              return (
                <Form.Item key={question.key} name={question.key} label={question.label} rules={[{ required: question.required, message: `${question.label} is required` }]}>
                  <Input placeholder={`Enter ${question.label.toLowerCase()}`} />
                </Form.Item>
              );

            case 'longText':
              return (
                <Form.Item key={question.key} name={question.key} label={question.label} rules={[{ required: question.required, message: `${question.label} is required` }]}>
                  <Input.TextArea rows={4} placeholder={`Enter ${question.label.toLowerCase()}`} />
                </Form.Item>
              );

            case 'number':
              return (
                <Form.Item key={question.key} name={question.key} label={question.label} rules={[{ required: question.required, message: `${question.label} is required` }]}>
                  <InputNumber style={{ width: '100%' }} placeholder={`Enter ${question.label.toLowerCase()}`} />
                </Form.Item>
              );

            case 'singleSelect':
              return (
                <Form.Item key={question.key} name={question.key} label={question.label} rules={[{ required: question.required, message: `${question.label} is required` }]}>
                  <select className={styles.select}>
                    <option value="">Select...</option>
                    {question.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Form.Item>
              );

            case 'multiSelect':
              return (
                <Form.Item key={question.key} name={question.key} label={question.label} rules={[{ required: question.required, message: `${question.label} is required` }]}>
                  <Checkbox.Group options={question.options} />
                </Form.Item>
              );

            case 'boolean':
              return (
                <Form.Item
                  key={question.key}
                  name={question.key}
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) => (question.required && !value ? Promise.reject(new Error(`${question.label} is required`)) : Promise.resolve()),
                    },
                  ]}
                >
                  <Checkbox>{question.label}</Checkbox>
                </Form.Item>
              );

            case 'url':
              return (
                <Form.Item
                  key={question.key}
                  name={question.key}
                  label={question.label}
                  rules={[
                    { required: question.required, message: `${question.label} is required` },
                    { type: 'url', message: 'Please enter a valid URL' },
                  ]}
                >
                  <Input placeholder={`Enter ${question.label.toLowerCase()}`} />
                </Form.Item>
              );

            default:
              return null;
          }
        })}

        <Form.Item className={styles.actions}>
          <Button onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegistrationModal;

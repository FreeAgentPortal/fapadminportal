'use client';
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useInterfaceStore } from '@/state/interface';
import axios from '@/utils/axios';
import styles from './DeletePostModal.module.scss';

interface DeletePostModalProps {
  postId: string;
  open: boolean;
  onClose: () => void;
}

const DeletePostModal = ({ postId, open, onClose }: DeletePostModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const addAlert = useInterfaceStore((state) => state.addAlert);

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/feed/activity/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      addAlert({ message: 'Post deleted successfully', type: 'success' });
      setIsDeleting(false);
      onClose();
    },
    onError: (error: any) => {
      addAlert({ message: error?.response?.data?.message || 'Failed to delete post', type: 'error' });
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate(postId);
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ExclamationCircleOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />
          <span>Delete Post</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={450}
      className={styles.modal}
    >
      <div className={styles.content}>
        <p className={styles.message}>
          Are you sure you want to delete this post? This action cannot be undone.
        </p>

        <div className={styles.actions}>
          <Button onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={handleDelete} 
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePostModal;

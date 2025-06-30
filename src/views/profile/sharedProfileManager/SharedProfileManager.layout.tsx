import React, { useState } from 'react';
import { Button, Card, Input, InputNumber, Modal, Popconfirm, Select, message } from 'antd';
import styles from './SharedProfileManager.module.scss';

type AllowedItem = { key: string; label: string; unit?: string };
type Mode = 'map' | 'list';

interface SharedProfileManagerProps {
  title: string;
  mode: Mode;
  data: Record<string, any> | string[];
  allowedItems?: AllowedItem[]; // Only required for 'map' mode
  onSave: (updatedData: any) => void;
  validateItem?: (value: string) => boolean;
}

const SharedProfileManager: React.FC<SharedProfileManagerProps> = ({ title, mode, data, allowedItems = [], onSave, validateItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const isMapMode = mode === 'map';

  const openAddModal = () => {
    resetModal();
    setModalOpen(true);
  };

  const openEditModal = (key: string, value: any) => {
    setSelectedKey(key);
    setInputValue(value);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (isMapMode) {
      const updated = { ...(data as Record<string, any>), [selectedKey!]: inputValue };
      onSave(updated);
    } else {
      if (validateItem && !validateItem(inputValue)) {
        message.error('Please enter a valid https link');
        return;
      }
      const updated = [...(data as string[])];
      if (isEditing && selectedKey !== null) {
        updated[parseInt(selectedKey)] = inputValue;
      } else {
        updated.push(inputValue);
      }
      onSave(updated);
    }
    resetModal();
  };

  const handleDelete = (key: string | number) => {
    if (isMapMode) {
      const updated = { ...(data as Record<string, any>) };
      delete updated[key as string];
      onSave(updated);
    } else {
      const updated = [...(data as string[])];
      updated.splice(key as number, 1);
      onSave(updated);
    }
  };

  const resetModal = () => {
    setSelectedKey(null);
    setInputValue(null);
    setIsEditing(false);
    setModalOpen(false);
  };

  const renderCards = () => {
    if (isMapMode) {
      const entries = Object.entries(data as Record<string, any>);
      if (entries.length === 0) return <p>No {title.toLowerCase()} added yet.</p>;

      return (
        <div className={styles.grid}>
          {entries.map(([key, value]) => {
            const meta = allowedItems.find((m) => m.key === key);
            const label = meta?.label || key;
            const unit = meta?.unit || '';

            return (
              <Card key={key} className={styles.card}>
                <div className={styles.label}>{label}</div>
                <div className={styles.value}>
                  {value} {unit}
                </div>
                <div className={styles.actions}>
                  <Button type="link" onClick={() => openEditModal(key, value)}>
                    Edit
                  </Button>
                  <Popconfirm title="Delete?" onConfirm={() => handleDelete(key)}>
                    <Button type="link" danger>
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            );
          })}
        </div>
      );
    } else {
      const items = data as string[];
      if (items.length === 0) return <p>No {title.toLowerCase()} added yet.</p>;

      return (
        <div className={styles.grid}>
          {items.map((item, idx) => (
            <Card key={idx} className={styles.card}>
              <div className={styles.value}>{item}</div>
              <div className={styles.actions}>
                <Button type="link" onClick={() => openEditModal(idx.toString(), item)}>
                  Edit
                </Button>
                <Popconfirm title="Delete?" onConfirm={() => handleDelete(idx)}>
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>
      );
    }
  };

  const renderModalContent = () => {
    if (isMapMode) {
      return (
        <>
          <Select disabled={isEditing} placeholder="Select field" style={{ width: '100%', marginBottom: '1rem' }} onChange={setSelectedKey} value={selectedKey}>
            {allowedItems
              .filter((m) => !(data as Record<string, any>)[m.key] || (isEditing && m.key === selectedKey))
              .map((m) => (
                <Select.Option key={m.key} value={m.key}>
                  {m.label}
                </Select.Option>
              ))}
          </Select>

          {selectedKey && (
            <InputNumber
              style={{ width: '100%' }}
              placeholder={`Enter value in ${allowedItems.find((m) => m.key === selectedKey)?.unit}`}
              value={inputValue}
              onChange={setInputValue}
            />
          )}
        </>
      );
    } else {
      return <Input placeholder="Enter value" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />;
    }
  };

  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {renderCards()}
      <Button type="dashed" block onClick={openAddModal} className={styles.addButton}>
        + Add {title}
      </Button>

      <Modal open={modalOpen} title={isEditing ? `Edit ${title}` : `Add ${title}`} onCancel={resetModal} onOk={handleSave} okText="Save">
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default SharedProfileManager;

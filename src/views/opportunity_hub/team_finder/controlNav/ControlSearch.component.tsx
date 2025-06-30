'use client';
import React, { useState } from 'react';
import styles from './ControlSearch.module.scss';
import { Button, Checkbox, Input, Select, Slider } from 'antd';
import useApiHook from '@/hooks/useApi';
import { useSearchStore } from '@/state/search';

const ControlSearch = () => {
  const { pageNumber, filter, modifyFilter, setSearch } = useSearchStore((state) => state);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    openToTryouts: false,
  });

  const onChangeHandler = (key: string, value: any) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    // create an array of keys
    const keys = Object.keys(searchParams);
    // create an array of values
    const values = Object.values(searchParams);
    //create a string of key-value pairs seperated by ; and |
    // we also want to skip the keyword search for filtering that will be handled by search
    const filterString = keys
      .map((key, index) => {
        if (key === 'keyword') return ''; // skip keyword for filtering
        if (Array.isArray(values[index])) {
          return values[index].length > 0 ? `${key}:${values[index].join(',')}` : '';
        }
        return values[index] ? `${key}:${values[index]}` : '';
      })
      .filter(Boolean)
      .join('|');
    // set the search keyword
    setSearch(searchParams.keyword);
    // set the filter in the search store
    modifyFilter(filterString);
  };

  return (
    <div className={styles.container}>
      <h3>Search Teams</h3>

      <div className={styles.field}>
        <Input value={searchParams.keyword} onChange={(e) => onChangeHandler('keyword', e.target.value)} placeholder="Team name, coach, etc." />
      </div>

      <div className={styles.checkboxGroup}>
        <Checkbox checked={searchParams.openToTryouts} onChange={(e) => onChangeHandler('openToTryouts', e.target.checked)}>
          Currently recruiting
        </Checkbox>
      </div>
      <Button type="primary" onClick={handleSubmit} className={styles.searchButton}>
        Search
      </Button>
    </div>
  );
};

export default ControlSearch;

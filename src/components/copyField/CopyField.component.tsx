import { message } from 'antd';
import { ReactNode, useState } from 'react';
import { FaClipboardCheck, FaCopy } from 'react-icons/fa';
import styles from './CopyField.module.scss';

type Props = {
  data: string;
  isLink?: boolean;
};
const CopyField = (props: Props) => {
  const [copyButton, setCopyButton] = useState<ReactNode>(<FaCopy />);

  const copy = () => {
    navigator.clipboard.writeText(props.data);

    setCopyButton(
      <FaClipboardCheck
        style={{
          fontSize: '15px',
        }}
      />
    );
    message.success('Copied to clipboard');
    setTimeout(() => {
      setCopyButton(<FaCopy />);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {props.isLink ? (
        <a
          href={props.data}
          className={styles.field}
          target="_blank"
          rel="noreferrer"
          style={{
            textDecoration: 'underline',
          }}
        >
          {props.data}
        </a>
      ) : (
        <p className={styles.field}>{props.data}</p>
      )}
      <div className={styles.copy} onClick={() => copy()}>
        {copyButton}
      </div>
    </div>
  );
};

export default CopyField;

import styles from './Card.module.scss';
type Props = {
  children: React.ReactNode;
  title: string;
  gridKey: string;
};

const Card = (props: Props) => {
  return (
    <div
      className={styles.container}
      style={{
        gridArea: props.gridKey,
      }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>{props.title}</h1>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default Card;

import styles from './Container.module.scss';

type Props = {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  className?: string;
};

const Container = (props: Props) => {
  return (
    <>
      <h1 className={styles.title}>{props.title}</h1>

      <div
        className={`${styles.container} ${props.className && props.className}`}
      >
        {props.children}
      </div>
    </>
  );
};

export default Container;

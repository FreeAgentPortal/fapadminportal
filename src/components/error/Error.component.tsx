import { Result } from "antd";
import styles from "./Error.module.scss";
import { MdError } from "react-icons/md";

type Props = {
  error: any;
  errorList?: { icon: any; text: string }[];
};

const Error = (props: Props) => {
  return (
    <div className={styles.container}>
      <Result status="error" title="Something went wrong" subTitle={props.error} icon={<MdError className={styles.icon} />} />
    </div>
  );
};

export default Error;

import Container from '@/layout/container/Container.layout';
import { Button, Result } from 'antd';
import Link from 'next/link';

import styles from './BlockedMessage.module.scss';

type Props = {
  neededFeature: string;
  noContainer?: boolean;
  type: 'feature' | 'verification' | 'blacklist';
};

const BlockedMessage = (props: Props) => {
  const getMessage = () => {
    switch (props.type) {
      case 'feature':
        return {
          title: 'You do not have access to this feature.',
          subtitle: `You need to have the ${props.neededFeature} feature enabled to access this page.`,
          buttonText: 'Go to Features',
          link: '/features',
        };

      case 'verification':
        return {
          title: 'We are still verifying your account.',
          subtitle: `You will be able to access this feature once your account is verified by Truthcasting.  One of our representatives will reach out to you through email, phone call, or through your website to verify your account details within the next business day. \n\nThank you for choosing Truthcasting. If you have any questions
            or concerns, please do not hesitate to contact us, through our
            Support widget.`,
          buttonText: 'Go to Dashboard',
          link: '/home',
        };

      case 'blacklist':
        return {
          title: 'Your account has been blacklisted.',
          subtitle: 'Please contact Truthcasting support for more information.',
          buttonText: 'Go to Dashboard',
          link: '/home',
        };
    }
  };

  const content = (
    <Result
      status="warning"
      title={getMessage().title}
      subTitle={getMessage().subtitle}
      extra={
        <Link href={getMessage().link}>
          <Button type="primary">{getMessage().buttonText}</Button>
        </Link>
      }
    />
  );
  if (props.noContainer) return content;
  return <Container className={styles.container}>{content}</Container>;
};

export default BlockedMessage;

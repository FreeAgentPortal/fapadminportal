import Error from '@/components/error/Error.component';
import Loader from '@/components/loader/Loader.component';
import { useUser } from '@/state/auth';
import { Descriptions, Modal, Skeleton } from 'antd';
import moment from 'moment';

import styles from './PaymentHistoryCard.module.scss';

/**
 * @description - This component displays the user's current features. It is a card component that is used in the billing page.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Nadia Dorado
 * @lastModifiedOn 06/01/2023
 */

const PaymentHistoryCard = () => {
  // const { data: paymentData, error, isLoading, isError } = useNextPaymentDate();
  const { data: loggedInData } = useUser();
  // const { data: receipts } = useReceiptData(loggedInData?._id, "");
  // const { mutate: downloadReceipt, isLoading: downloadIsLoading } = useDownloadReceipt();

  // if (isLoading) return <Skeleton active />;
  // if (isError) return <Error error={error} />;

  const DateTimeFormat = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    <div className={styles.container}>
      <Modal
        // open={downloadIsLoading}
        footer={null}
        closable={false}
        centered
      >
        <Loader title="Downloading receipt..." />
      </Modal>

      {/* {receipts?.receipts?.map((receipt: any, index: number) => {
        return (
          <div className={styles.receipt} key={receipt._id}>
            <div className={styles.details}>
              <div className={styles.date}>
                <div>
                  <h2>{receipt.type === "sale" ? "purchased" : `${receipt.type}ed`} on</h2>
                  <h1>{` ${moment(receipt.billedAt).format("MM/DD/YYYY")}` || "N/A"}</h1>
                </div>
              </div>
              <Descriptions size="small" className={styles.paymentInfoContainer} contentStyle={{ minWidth: "100px" }}>
                <Descriptions.Item label="Transaction ID">{receipt.transactionId}</Descriptions.Item>
                <Descriptions.Item label="Item">{receipt.memo}</Descriptions.Item>
                <Descriptions.Item label="Payment Method">{receipt.paymentMethod}</Descriptions.Item>
                <Descriptions.Item label="Amount Paid">${receipt.amount.toFixed(2)}</Descriptions.Item>
              </Descriptions>

              <div className={styles.download}>
                <Button
                  type="text"
                  onClick={() => downloadReceipt(receipt._id)}
                >
                  <AiOutlineDownload />
                </Button>
              </div>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};
export default PaymentHistoryCard;

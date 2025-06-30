import { AiOutlineBank, AiOutlineCreditCard } from 'react-icons/ai';
import styles from './PaymentInformation.module.scss';
import { Button, Card, Tooltip } from 'antd';
import { useInterfaceStore } from '@/state/interface';
import CardForm from './forms/CardForm.component';
import { AnimatePresence, motion } from 'framer-motion';
import AchForm from './forms/AchForm.component';
import { FaChevronCircleLeft } from 'react-icons/fa';
import { usePaymentStore } from '@/state/payment';

const PaymentInformationForm = () => {
  const { paymentMethod, setPaymentMethod } = usePaymentStore((state) => state);
  const getForm = () => {
    switch (paymentMethod) {
      case 'ach':
        return (
          <div>
            {/* button to reset the form */}
            <Button onClick={() => setPaymentMethod('')} className={styles.resetButton}>
              <Tooltip title="Go back">
                <FaChevronCircleLeft />
              </Tooltip>
            </Button>
            <div className={styles.paymentHeader}>
              <AiOutlineBank />
              Bank Account (ACH)
            </div>
            <p style={{ marginTop: '1%', color: 'gray', textAlign: 'center' }}>
              Customer account information is not stored by PyreProcessing. We take the security of your customers&apos; information very seriously, which is why we use a third-party
              vaulting system provided by NMI. All credit card and ACH information is securely stored with them, ensuring compliance with PCI DSS standards.
            </p>
            <AchForm />
          </div>
        );
      case 'creditcard':
        return (
          <div>
            <Button onClick={() => setPaymentMethod('')} className={styles.resetButton}>
              <Tooltip title="Go back">
                <FaChevronCircleLeft />
              </Tooltip>
            </Button>
            <div className={styles.paymentHeader}>
              <AiOutlineCreditCard />
              Credit/Debit Card
            </div>
            <p style={{ marginTop: '1%', color: 'gray', textAlign: 'center' }}>
              Customer account information is not stored by PyreProcessing. We take the security of your customers&apos; information very seriously, which is why we use a third-party
              vaulting system provided by NMI. All credit card and ACH information is securely stored with them, ensuring compliance with PCI DSS standards.
            </p>
            <CardForm />
          </div>
        );
      default:
        return (
          <div className={styles.container}>
            {/* <h1 className={styles.header}>Customer payment method</h1> */}
            <div className={styles.paymentMethodContainer}>
              <Tooltip title="ACH unavailable at this time">
                <Button className={styles.paymentMethodButton} onClick={() => setPaymentMethod('ach')} disabled>
                  <AiOutlineBank />
                  <span>Bank Account (ACH)</span>
                </Button>
              </Tooltip>
              <Button className={styles.paymentMethodButton} onClick={() => setPaymentMethod('creditcard')}>
                <AiOutlineCreditCard />
                <span>Credit/Debit Card</span>
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <AnimatePresence initial={true} mode="wait">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            ease: 'easeInOut',
            duration: 0.3,
          }}
          exit={{
            opacity: 0,
            y: 20,
          }}
          key={paymentMethod}
        >
          {getForm()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentInformationForm;

// async function checkCouponCode() {
//   try {
//     const { data } = await axios.post(`/coupon/check`, { code });
//     if (data.success === true) {
//       // alert the user that the username is taken
//       setCouponCodeValid(true);
//       setDiscount(data.coupon.discount);
//       dispatch(
//         setAlert(
//           `You received a ${data.coupon.discount.toFixed(2)}% discount`,
//           'success'
//         )
//       );
//     } else {
//       setCouponCodeValid(false);
//       setDiscount(0);
//     }
//   } catch (err) {
//     setCouponCodeValid(false);
//     setDiscount(0);
//   }
// }

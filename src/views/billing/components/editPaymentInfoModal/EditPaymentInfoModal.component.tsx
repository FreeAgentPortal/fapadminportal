import { useState } from "react";
import { useUser } from "@/state/auth";
import { Modal, Button, Row, Col, Skeleton } from "antd";
import Error from "@/components/error/Error.component";

// components
import EditCreditCardForm from "./views/editCreditView/EditCreditCardViewForm.component";
import EditAchCardForm from "./views/editAchView/EditAchViewForm.component";

import styles from "./EditPaymentInfoModal.module.scss";
import { AiOutlineBank, AiOutlineCreditCard } from "react-icons/ai";
import Loader from "@/components/loader/Loader.component";
/**
 * @description - This modal displays the the two options for the user to edit their payment information.
 * @author Nadia Dorado
 * @since 1.0
 * @version 1.0.0
 * @lastModifiedBy Nadia Dorado
 * @lastModifiedOn 06/23/2023
 */

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const EditPaymentInfoModal = (props: Props) => {
  const { data: userDetails, error, isLoading, isError } = useUser();
  const [currentView, setCurrentView] = useState<"current" | "cc" | "ach">("current");
  // const { isLoading: billingUpdateIsLoading } = useUpdateBillingData();
  const handleViewChange = (view: "current" | "cc" | "ach") => {
    setCurrentView(view);
  };
  const closeModal = () => {
    props.setOpen(false);
    setCurrentView("current");
  };

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;

  const getViews = () => {
    switch (currentView) {
      case "current":
        return (
          <div className={styles.container}>
            <h3>Choose your Payment Method</h3>
            <div className={styles.options}>
              <Button className={styles.button} onClick={() => handleViewChange("cc")} block>
                <AiOutlineCreditCard style={{ fontSize: "45px" }} /> <br />
                Credit Card
              </Button>

              <Button className={styles.button} onClick={() => handleViewChange("ach")} block>
                <AiOutlineBank style={{ fontSize: "45px" }} />
                <br />
                Bank / ACH
              </Button>
            </div>
          </div>
        );
        break;
      case "cc":
        return <EditCreditCardForm closeModal={() => closeModal()} />;
        break;
      case "ach":
        return <EditAchCardForm closeModal={() => closeModal()} />;
        break;
    }
  };

  return (
    <Modal
      title="Edit Payment Information"
      width={700}
      open={props.open}
      onCancel={() => {
        closeModal();
      }}
      footer={null}
    >
      {/* {billingUpdateIsLoading ? (
        <Loader title="Updating Your Payment Info" />
      ) : (
        getViews()
      )} */}
    </Modal>
  );
};

export default EditPaymentInfoModal;

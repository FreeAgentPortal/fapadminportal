import styles from './PaymentCard.module.scss';
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import { Table, Button, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Error from '@/components/error/Error.component';
import Link from 'next/link';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

const PaymentCard = () => {
  const queryClient = useQueryClient();
  const selectedProfile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const {
    data: paymentData,
    error,
    isLoading,
    isError,
  } = useApiHook({
    key: 'payment-details',
    method: 'GET',
    url: `/payment/receipt/${selectedProfile?.payload?._id}`,
  }) as any;
  interface DataType {
    amount: number;
    date: string;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => {
        return <p className={styles.amount}>${amount}</p>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        return <p className={styles.date}>{date}</p>;
      },
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <Error error={error} />;
  const DateTimeFormat = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1>
          {Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(paymentData?.data?.nextPaymentAmount)}
        </h1>
        <p>{DateTimeFormat.format(new Date(paymentData?.data?.nextPaymentDate ?? Date.now()))}</p>

        <ResponsiveContainer width="99%" aspect={4} className={styles.barChartContainer}>
          <BarChart
            data={paymentData?.receipts.map((r: any) => {
              return { amount: r.amount.toFixed(2) };
            })}
            className={styles.barChart}
          >
            <Bar dataKey="amount" fill="#557797" fillOpacity={0.4} />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.previousPaymentsContainer}>
        <div className={styles.previousPayments}>
          <h1>Previous Payments</h1>
          <Table
            dataSource={paymentData?.payload?.map((r: any) => {
                return {
                  amount: r.amount.toFixed(2),
                  date: DateTimeFormat.format(new Date(r.billedAt)),
                };
              })
              .splice(0, 2)}
            pagination={false}
            columns={columns}
          />
        </div>
      </div>
      <Link href="/billing">
        <Button type="text">View More</Button>
      </Link>
    </div>
  );
};

export default PaymentCard;

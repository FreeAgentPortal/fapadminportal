"use client";
import React, { JSX, useMemo } from "react";
import styles from "./SupportDetails.module.scss";
import { useParams } from "next/navigation";
import Loader from "@/components/loader/Loader.component";
import Error from "@/components/error/Error.component";
import { Button, Divider, Form, Input, Tag } from "antd";
import { useUser } from "@/state/auth";
import TinyEditor from "@/components/tinyEditor/TinyEditor.component";
import parse from "html-react-parser";
import { timeDifference } from "@/utils/timeDifference";
import { useMessages } from "@/hooks/useInfiniteMessages";
import { useSocketStore } from "@/state/socket";
import { useQueryClient } from "@tanstack/react-query";
import useApiHook from "@/hooks/useApi";
import { ControlNavItem } from "@/types/navigation";
import SupportTicketOptions from "../support_ticket_options/SupportTicketOptions.component";
import { BsGear } from "react-icons/bs";
import { useSetControlNav } from "@/providers/ControlNavProvider";

const SupportDetails = () => {
  const [form] = Form.useForm();
  // pull the id from the url
  const { id } = useParams();
  const { data: loggedInData } = useUser();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  // socket events
  const { socket } = useSocketStore((state) => state);

  // Set up control navigation with user data - memoized to prevent infinite loops
  const controlNav = useMemo<ControlNavItem[] | null>(() => {
    return [
      {
        children: <SupportTicketOptions />,
        icon: <BsGear />,
        title: "Ticket Options",
      },
    ];
  }, []);

  useSetControlNav(controlNav);
  const { data, isLoading, isError, error } = useApiHook({
    url: `/support/ticket/${id}`,
    key: "ticket",
    enabled: !!id,
    method: "GET",
  }) as any;

  const { data: messagesData, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(id as any);
  const { mutate: sendMessage } = useApiHook({
    key: "message",
    method: "POST",
    queriesToInvalidate: ["messages"],
  }) as any;

  const handleScroll = () => {
    if (!containerRef.current || !hasNextPage || isFetchingNextPage) return;
    const { scrollTop } = containerRef.current;
    if (scrollTop === 0) {
      // Fetch older messages when scrolled to the top
      fetchNextPage();
    }
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNextPage, isFetchingNextPage]);

  const handleMessage = () => {
    sendMessage({
      url: `/support/ticket/${id}/message`,
      formData: form.getFieldsValue(),
    });
    // clear the form after sending the message
    form.resetFields();
    // emit socket event to notify the support team of a new message
    socket.emit("sendNewMessage", {
      roomId: `support-${id}`,
      user: loggedInData,
      message: form.getFieldValue("message"),
    });
    // navigate to the bottom of the chat window
    const chatContainer = document.querySelector(`.${styles.chatContainer}`);
    chatContainer?.scrollTo(0, chatContainer.scrollHeight);
  };

  React.useEffect(() => {
    if (socket) {
      // join the room of the support ticket
      socket.emit("join", {
        roomId: `support-${id}`,
        user: loggedInData,
      });
      socket.on("newMessage", () => {
        queryClient.invalidateQueries({ queryKey: ["messages", `${id}`] });
        // scroll to bottom of chat window
        const chatContainer = document.querySelector(`.${styles.chatContainer}`);
        setTimeout(() => chatContainer?.scrollTo(0, chatContainer.scrollHeight), 1000);
      });
    }
  }, [socket]);

  // when page is finished loading and messages are fetched, push the user to the bottom of the chat window
  React.useEffect(() => {
    if (messagesData?.pages.length) {
      //use the container ref to scroll to the bottom of the chat window
      const chatContainer = containerRef.current;
      // smooth scroll after 1 second
      setTimeout(() => chatContainer?.scrollTo(0, chatContainer.scrollHeight), 1000);
    }
  }, [messagesData]);

  if (isLoading) return <Loader />;
  if (isError) return <Error error={error.message} />;

  // Flatten all messages into a single array
  const messages = messagesData?.pages.flatMap((page) => page.data) || [];
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        {/* here the user will see the details of the support ticket */}
        <Divider orientation="left">
          Support Request <span className={styles.transactionId}>{id}</span>
          <Divider type="vertical" />
          <span className={styles.status}>
            {(() => {
              const statusMap: { [key: string]: JSX.Element } = {
                Open: (
                  <>
                    Is <Tag color="red">Open</Tag>
                  </>
                ),
                New: (
                  <>
                    Is <Tag color="gold">New</Tag>
                  </>
                ),
                Solved: (
                  <>
                    Has been <Tag color="grey">Solved</Tag>
                  </>
                ),
                Pending: (
                  <>
                    Is awaiting response from user <Tag color="blue">Pending</Tag>
                  </>
                ),
              };
              return statusMap[data?.payload?.data?.status] ?? <Tag color="blue">{data?.payload?.status}</Tag>;
            })()}
          </span>
        </Divider>
      </div>
      <div className={styles.chatWindow} ref={containerRef} id="chatWindow">
        {/* {isFetchingNextPage && <p>Loading older messages...</p>} */}
        <div className={styles.chatContainer}>
          {messages.map((message: any) => (
            <div
              key={message?._id}
              className={`${styles.chat} ${
                // if the message is from the user, align it to the right
                message?.user?.toString() === loggedInData?._id.toString() ? styles.rightChat : null
              }`}
            >
              <div
                className={`${styles.chatBubble} ${
                  // if the message is from the user, align it to the right
                  message?.user?.toString() === loggedInData?._id.toString()
                    ? styles.chatBubbleRight
                    : styles.leftBubble
                }`}
              >
                <div className={styles.message}>
                  <div className={`${styles.sender}`}>{message?.sender?.fullName}</div>
                  <div className={styles.chatText}>{parse(`${parse(message.message)}`)}</div>
                </div>
              </div>
              {/* timestamp */}
              <div
                className={`${styles.chatTime} ${
                  // if the message is from the user, align it to the right
                  message?.user?.toString() === loggedInData?._id.toString()
                    ? styles.chatTimeRight
                    : styles.chatTimeLeft
                }`}
              >
                {timeDifference(new Date().getTime(), new Date(message.createdAt).getTime())}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.responseContainer}>
        {/* here the user will use a WYSIWYG editor to add to the conversation */}
        <div className={styles.editor}>
          <Form layout="vertical" form={form}>
            <Form.Item name="message">
              <Input.TextArea
                placeholder="Type your message here..."
                autoSize={{ minRows: 3, maxRows: 6 }}
                className={styles.textArea}
              />
            </Form.Item>
            <Button onClick={handleMessage}>Send</Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SupportDetails;

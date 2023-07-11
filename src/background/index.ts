import {
  consumer,
  sender,
  MessageType,
  Reply,
  SuccessReply,
  ErrorReply,
} from "../lib/message";
import Notification from "../lib/message/notification";
import { api, downloadRequest } from "../lib/api";
import Storage from "../lib/storage";
import Browser from "webextension-polyfill";

/**
 * create context menu
 */
Browser.runtime.onInstalled.addListener(() => {
  Browser.contextMenus.create({
    id: "KubespiderMenu",
    title: "Send to Kubespider",
    contexts: ["all"],
  });
});

/**
 * handle context menu click
 */
Browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "KubespiderMenu") {
    const tabId = tab?.id;
    if (!tabId) {
      return;
    }
    let dataSource = info.linkUrl;
    if (dataSource === "" || dataSource == null) {
      dataSource = tab.url;
    }
    if (dataSource === "" || dataSource == null) {
      return;
    }
    const { server } = await Storage.read();
    if (!server || server === "") {
      Notification.error(
        await getTabId(),
        "Kubespider",
        "Please set server address first"
      );
      return;
    }
    const response = await api(downloadRequest(server, dataSource));
    if (response.status === 200) {
      Notification.success(
        await getTabId(),
        "Kubespider",
        `${dataSource} download success`
      );
    } else {
      Notification.error(await getTabId(), "Kubespider", `${response.body}}`);
    }
  }
});

/**
 * handle download request
 */
consumer.addListener(MessageType.Download, async (payload): Promise<Reply> => {
  const { dataSource, path, cookie } = payload as {
    dataSource: string;
    path?: string;
    cookie?: string;
  };
  const { server } = await Storage.read();
  if (!server || server === "") {
    return ErrorReply("Please set server address first");
  }
  const response = await api(
    downloadRequest(server, dataSource, path || "", cookie)
  );
  if (response.status === 200) {
    Notification.success(
      await getTabId(),
      "Kubespider",
      `${dataSource} download success`
    );
    return SuccessReply();
  } else {
    Notification.error(await getTabId(), "Kubespider", `${response.body}`);
    return ErrorReply();
  }
});

// ========== listen to messages from content&popup ==========
async function getTabId(): Promise<number> {
  const [tab] = await Browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    return -1;
  }
  if (!tab.id) {
    return -1;
  }
  return tab.id;
}

consumer.addListener(
  MessageType.Notification,
  async (payload): Promise<Reply> => {
    // notification resend to content
    let { tabId } = payload as { tabId?: number };
    if (tabId) {
      console.log("[kubespider] notification receive from content");
      return SuccessReply();
    }
    tabId = await getTabId();
    if (tabId === -1) {
      return ErrorReply("No active tab");
    }
    return sender.sendMessage({
      type: MessageType.Notification,
      reciver: tabId,
      payload,
    });
  }
);

import Browser from "webextension-polyfill";

namespace Tab {
  export async function getCurrentTabId(): Promise<number> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab?.id || -1;
  }

  export function create(url: string) {
    Browser.tabs.create({ url });
  }
}

namespace Action {
  export async function setBadgeText(text: string) {
    Browser.action.setBadgeText({
      text,
    });
  }
}

export { Tab, Action };

import { useState } from "react";
import { Input, Button } from "../lib/component/Input";
import { MessageType, sender } from "../lib/message";

function Download() {
  const [form, setForm] = useState({
    dataSource: "",
    path: "",
  });
  // button state
  const [btn, setBtn] = useState({
    label: "Download",
    type: "normal",
    loading: false,
  } as {
    label: string;
    type: "normal" | "error";
    loading: boolean;
  });
  // update form data
  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  // send message to background
  const onClick = async () => {
    setBtn((prev) => ({ ...prev, loading: true }));
    if (!form.dataSource || form.dataSource === "") {
      setBtn((prev) => ({
        ...prev,
        type: "error",
        loading: false,
        label: "Download Error!",
      }));
      return;
    }
    const reply = await sender.sendMessage({
      type: MessageType.Download,
      payload: {
        dataSource: form.dataSource,
        path: form.path,
      },
    });
    if (reply.success) {
      setBtn((prev) => ({ ...prev, loading: false }));
    } else {
      setBtn((prev) => ({
        ...prev,
        type: "error",
        loading: false,
        label: "Download Error!",
      }));
    }
  };

  return (
    <>
      <Input
        name="dataSource"
        value={form.dataSource}
        lable="URL"
        onChange={handleChange}
      />
      <Input
        name="path"
        value={form.path}
        lable="PATH"
        onChange={handleChange}
      />
      <Button
        label={btn.label}
        type={btn.type}
        loading={btn.loading}
        onClick={onClick}
      />
    </>
  );
}

export default Download;

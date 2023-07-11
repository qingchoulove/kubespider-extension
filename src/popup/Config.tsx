import { useEffect, useState } from "react";
import { Input, Switch, Button } from "../lib/component/Input";
import Storage from "../lib/storage";
import { api, healthzRequest } from "../lib/api";

function Config() {
  const [form, setForm] = useState({
    server: "",
    enableAuth: false,
    token: "",
    captureCookies: false,
  });

  const [btn, setBtn] = useState({
    label: "Save",
    type: "normal",
    loading: false,
  } as {
    label: string;
    type: "normal" | "error";
    loading: boolean;
  });

  useEffect(() => {
    Storage.read().then((config) => {
      setForm({
        server: config.server,
        enableAuth: config.auth || false,
        token: config.token || "",
        captureCookies: config.captureCookies || false,
      });
    });
  }, []);

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleClick = async () => {
    setBtn((prev) => ({ ...prev, loading: true }));
    const param = healthzRequest(form.server);
    const response = await api(param);
    if (response.status !== 200) {
      setBtn((prev) => ({
        ...prev,
        loading: false,
        type: "error",
        label: "Error",
      }));
      return;
    }
    Storage.save({
      server: form.server,
      auth: form.enableAuth,
      token: form.token,
      captureCookies: form.captureCookies,
    });
    setBtn((prev) => ({ ...prev, loading: false }));
  };

  return (
    <>
      <Input
        name="server"
        value={form.server}
        lable="SERVER"
        onChange={handleChange}
      />
      <Switch
        name="enableAuth"
        value={form.enableAuth}
        label="Enable Auth"
        onChange={handleChange}
      />
      {form.enableAuth && (
        <Input
          name="token"
          value={form.token}
          lable="TOKEN"
          onChange={handleChange}
        />
      )}
      <Switch
        name="captureCookies"
        value={form.captureCookies}
        label="Capture Cookies"
        onChange={handleChange}
      />
      <Button
        label={btn.label}
        type={btn.type}
        loading={btn.loading}
        onClick={handleClick}
      />
    </>
  );
}

export default Config;

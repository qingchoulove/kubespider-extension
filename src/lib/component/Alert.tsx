import { useEffect, useState } from "react";
import { Error, Success } from "./Svg";

enum AlertType {
  Success = "success",
  Error = "error",
}

interface Props {
  title: string;
  content: string;
  type?: AlertType;
  delay?: number;
}

function SuccessAlert({ title, content }: Props) {
  return (
    <div
      className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
      role="alert"
    >
      <div className="flex items-center">
        <div>
          <Success />
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm break-all">{content}</p>
        </div>
      </div>
    </div>
  );
}

function ErrorAlert({ title, content }: Props) {
  return (
    <div
      className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
      role="alert"
    >
      <div className="flex items-center">
        <div>
          <Error />
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm break-all">{content}</p>
        </div>
      </div>
    </div>
  );
}

function Alert({
  title,
  content,
  type = AlertType.Success,
  delay = 4500,
}: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setShow(false);
    }, delay);
  });

  return (
    <>
      {show &&
        (type === AlertType.Success ? (
          <SuccessAlert title={title} content={content} />
        ) : (
          <ErrorAlert title={title} content={content} />
        ))}
    </>
  );
}

export { Alert, AlertType };

interface MessageProps {
  variant?: "success" | "error" | "info" | "danger";
  children: React.ReactNode;
}

const Message = ({ variant, children }: MessageProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case "success":
        return "bg-amber-light text-amber-dark";
      case "error":
        return "bg-danger-subtle text-danger-dark";
      case "danger":
        return "bg-danger-subtle text-danger-dark";
      default:
        return "bg-primary-subtle text-primary-dark";
    }
  };

  return <div className={`p-4 rounded ${getVariantClass()}`}>{children}</div>;
};

export default Message;

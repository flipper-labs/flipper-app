interface StatusButtonProps {
  status: string;
  color: string;
}

export const StatusButton = ({ status, color }: StatusButtonProps) => {
  return (
    <div
      className={`box-border py-2 px-4 border-[1px] border-solid rounded-lg`}
      style={{ borderColor: `${color}`, color: `${color}` }}
    >
      {status}
    </div>
  );
};

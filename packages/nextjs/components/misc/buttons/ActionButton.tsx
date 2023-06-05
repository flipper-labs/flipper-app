import PlayIcon from "./../../../public/svgs/play.svg";

interface ActionButtonProps {
  action: string; // depends on match status
  color: string;
  background?: string;
  border?: string;
  paddingY?: number;
  paddingX?: number;
  iconToRight?: boolean;
  textSize?: string;
}

export const ActionButton = ({
  action,
  color,
  background,
  border,
  paddingY,
  paddingX,
  textSize = "text-lg",
  iconToRight = true,
}: ActionButtonProps) => {
  console.log(border);
  return (
    <div
      className={`
      box-border flex flex-row justify-center items-center py-2 gap-2 cursor-pointer
      transition duration-150 hover:scale-105 rounded-lg
      `}
      style={{
        color: `${color}`,
        background: `${background ? background : ""}`,
        border: `${border ? "1px solid" : "0px"}`,
        borderColor: `${border ? border : ""}`,
        paddingTop: `${paddingY ? paddingY : 0}rem`,
        paddingBottom: `${paddingY ? paddingY : 0}rem`,
        paddingLeft: `${paddingX ? paddingX : 0}rem`,
        paddingRight: `${paddingX ? paddingX : 0}rem`,
      }}
    >
      {!iconToRight && <PlayIcon stroke={color} />}
      <div className={textSize}>{action}</div>
      {iconToRight && <PlayIcon stroke={color} />}
    </div>
  );
};

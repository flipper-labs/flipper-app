import Image from "next/image";
import Link from "next/link";
import { ActionButton } from "../misc/buttons/ActionButton";

export const Cover = (props: any) => {
  return (
    <div className="flex flex-row gap-10 w-4/5 justify-between">
      <div className="bg-red-400 w-[70%]">
        <Image
          src="/cover.png"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }} // optional
          alt="cover"
        />
      </div>
      { props.address &&
      <div className="flex flex-col justify-around">
        <Link href="/match/create">
          <ActionButton
            action="Create Match"
            color="white"
            iconToRight={false}
            background="#F050F2"
            paddingX={3}
            paddingY={1}
          />
        </Link>
        <ActionButton
          action="Invite Friend"
          color="#F050F2"
          iconToRight={false}
          border="#F050F2"
          paddingX={3}
          paddingY={1}
        />
      </div>
      }
    </div>
  );
};

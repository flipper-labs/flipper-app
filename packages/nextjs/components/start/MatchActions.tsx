import { ActionButton } from "../misc/buttons/ActionButton";
import { DropdownMenu } from "../DropdownMenu";

export const MatchActions = () => {

  const handleClick = () => {
    console.log('Div clicked!');
    // Perform your desired actions here
  };

  return (
    <div className="box-border w-4/5 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4">
        {/* Filter */}
        <ActionButton
          action="Filter"
          color="white"
          iconToRight={false}
          background="#650BBF"
          paddingX={2}
          paddingY={0.5}
          textSize="text-sm"
          onClick={handleClick}
        />
        <DropdownMenu/>
        {/* Sort */}
        <ActionButton
          action="Sort by"
          color="white"
          iconToRight={false}
          background="gray"
          paddingX={2}
          paddingY={0.5}
          textSize="text-sm"
        />
      </div>
      <div>Search</div>
    </div>
  );
};

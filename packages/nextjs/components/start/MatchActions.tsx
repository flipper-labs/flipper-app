import { DropdownMenu } from "../misc/DropdownMenu";
import { SearchInput } from "../misc/SearchInput";
import { ActionButton, ActionType } from "../misc/buttons/ActionButton";

export const MatchActions = (props: any) => {
  return (
    <div className="box-border w-4/5 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4">
        {/* Filter */}
        <DropdownMenu
          statusFilter={props.statusFilter}
          setStatusFilter={props.setStatusFilter}
          nftNumberFilter={props.nftNumberFilter}
          setNftNumberFilter={props.setNftNumberFilter}
        />
        {/* Sort */}
        <ActionButton
          action={ActionType.Sort}
          color="white"
          iconToRight={false}
          background="gray"
          paddingX={1}
          paddingY={0.5}
          textSize="text-sm"
          displayRightChevron
        />
      </div>
      <SearchInput nameFilter={props.nameFilter} setNameFilter={props.setNameFilter} />
    </div>
  );
};

import { ActionButton } from "../misc/buttons/ActionButton";
import { DropdownMenu } from "../DropdownMenu";
import { SearchInput } from "../SearchInput";

export const MatchActions = (props: any) => {

  return (
    <div className="box-border w-4/5 flex flex-row justify-between items-center">
      <div className="flex flex-row gap-4">
        {/* Filter */}
        <DropdownMenu statusFilter={props.statusFilter} setStatusFilter={props.setStatusFilter}
                      nftNumberFilter={props.nftNumberFilter} setNftNumberFilter={props.setNftNumberFilter}/>
        {/* Sort */}
        {/* <ActionButton
          action="Sort by"
          color="white"
          iconToRight={false}
          background="gray"
          paddingX={2}
          paddingY={0.5}
          textSize="text-sm"
        /> */}
      </div>
      <SearchInput nameFilter={props.nameFilter} setNameFilter={props.setNameFilter} />
    </div>
  );
};

import React from "react";

export const RadioGroup = (props: any) => {
  const handleRadioChange = (event: any) => {
    var currStatus = JSON.parse(JSON.stringify(props.filter));

    for (let i = 0; i < currStatus.length; i++) {
      currStatus[i].checked = false;
    }

    currStatus[event.target.value].checked = !currStatus[event.target.value].checked;
    props.setFilter(currStatus);
  };

  return (
    <div className="flex flex-col">
      {props.filter.map((item: any, index: any) => (
        <label key={index}>
          <input
            type="radio"
            value={index}
            checked={item.checked}
            onChange={handleRadioChange}
            style={{ accentColor: "#650BBF" }}
          />
          {" " + item.name}
        </label>
      ))}
    </div>
  );
};

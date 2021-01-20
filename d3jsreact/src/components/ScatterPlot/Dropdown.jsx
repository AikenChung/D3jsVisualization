import React from 'react';

export const Dropdown = ({
  options,
  id,
  selectedValue,
  onSelectedValueChange,
}) => (
  <select
    id={id}
    onChange={(event) =>{
      console.log(event);
      onSelectedValueChange(event.target.value);}
    }
  >
    {options.map((d) => (
      <option
        value={d.value}
        selected={d.value === selectedValue}
      />
    ))}
  </select>
);
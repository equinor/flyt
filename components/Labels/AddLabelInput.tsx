import React, { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import { debounce } from "utils/debounce";
import { useQuery } from "react-query";
import { getLabels } from "services/labelsApi";
import "@reach/combobox/styles.css";
import { unknownErrorToString } from "utils/isError";
import { Button } from "@equinor/eds-core-react";
import styles from "./AddLabelInput.module.scss";

export default function AddLabelInput(props: {
  handleSelectTerm: (x: string) => void;
}): JSX.Element {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const handleChange = (event) => {
    setTerm(event.target.value);
  };
  const handleSelect = (item) => {
    props.handleSelectTerm(item);
    setTerm("");
  };
  const handleClickAdd = () => {
    props.handleSelectTerm(term);
    setTerm("");
  };

  useEffect(() => {
    debounce(
      () => {
        setDebouncedTerm(term);
      },
      200,
      "LabelSearchQuery"
    );
  }, [term]);

  const { data: labels, error } = useQuery(["labels", debouncedTerm], () =>
    getLabels(debouncedTerm)
  );

  return (
    <div className={styles.container}>
      {error && <p>{unknownErrorToString(error)}</p>}
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={term}
          onChange={handleChange}
          className={styles.textInput}
        />
        {!!labels && (
          <ComboboxPopover style={{ width: 300, zIndex: 5000 }}>
            {labels.length > 0 ? (
              <ComboboxList>
                {labels.map((label, index) => (
                  <ComboboxOption key={index} value={`${label.text}`} />
                ))}
              </ComboboxList>
            ) : (
              <div>
                <p style={{ padding: 10, textAlign: "center" }}>No results</p>
              </div>
            )}
          </ComboboxPopover>
        )}
      </Combobox>
      <Button
        color="primary"
        variant="contained"
        style={{ marginLeft: "20px" }}
        onClick={handleClickAdd}
      >
        Add
      </Button>
    </div>
  );
}

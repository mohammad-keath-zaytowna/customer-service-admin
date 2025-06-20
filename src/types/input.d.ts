interface BaseField {
  label: string;
  placeholder?: string;
}

export interface InputField extends BaseField {
  inputType: Exclude<React.HTMLInputTypeAttribute, "file">;
}

export interface SelectField extends BaseField {
  inputType: "select";
  options: { value: string; label: string }[];
}

export interface FileField extends BaseField {
  inputType: "file";
  accept?: string;
}

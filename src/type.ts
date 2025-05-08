export interface FlowResponse {
  name: string;
  description: string;
  icon: null;
  icon_bg_color: null;
  gradient: null;
  data: Data3;
  is_component: boolean;
  updated_at: string;
  webhook: boolean;
  endpoint_name: null;
  tags: string[];
  locked: boolean;
  fork_count: number;
  access_type: string;
  id: string;
  user_id: string;
  folder_id: string;
}

interface Data3 {
  nodes: Node2[];
  edges: Edge[];
  viewport: Viewport;
}

interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

interface Edge {
  animated: boolean;
  className: string;
  data: Data2;
  id: string;
  selected: boolean;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

interface Data2 {
  sourceHandle: SourceHandle;
  targetHandle: TargetHandle;
}

interface TargetHandle {
  fieldName: string;
  id: string;
  inputTypes: string[];
  type: string;
}

interface SourceHandle {
  dataType: string;
  id: string;
  name: string;
  output_types: string[];
}

interface Node2 {
  data: Data;
  dragging?: boolean;
  id: string;
  measured: Measured;
  position: Position;
  selected: boolean;
  type: string;
}

interface Position {
  x: number;
  y: number;
}

interface Measured {
  height: number;
  width: number;
}

interface Data {
  id: string;
  node: Node;
  type: string;
  showNode?: boolean;
}

interface Node {
  description: string;
  display_name: string;
  documentation: string;
  template: Template;
  base_classes?: string[];
  beta?: boolean;
  conditional_paths?: any[];
  custom_fields?: Dialoginputs;
  edited?: boolean;
  field_order?: string[];
  frozen?: boolean;
  icon?: string;
  legacy?: boolean;
  lf_version?: string;
  metadata?: Dialoginputs;
  minimized?: boolean;
  output_types?: any[];
  outputs?: Output[];
  pinned?: boolean;
  tool_mode?: boolean;
  category?: string;
  key?: string;
  score?: number;
}

interface Output {
  allows_loop: boolean;
  cache: boolean;
  display_name: string;
  method: string;
  name: string;
  selected: string;
  tool_mode: boolean;
  types: string[];
  value: string;
  hidden?: null;
  required_inputs?: null;
  options?: null;
}

interface Template {
  backgroundColor?: string;
  _type?: string;
  add_current_date_tool?: Addcurrentdatetool;
  agent_description?: Agentdescription;
  agent_llm?: Agentllm;
  api_key?: Apikey;
  code?: Code;
  handle_parsing_errors?: Addcurrentdatetool;
  input_value?: Inputvalue;
  json_mode?: Addcurrentdatetool;
  max_iterations?: Maxiterations;
  max_retries?: Maxiterations;
  max_tokens?: Maxtokens;
  memory?: Memory;
  model_kwargs?: Modelkwargs;
  model_name?: Modelname;
  n_messages?: Maxiterations;
  openai_api_base?: Openaiapibase;
  order?: Order;
  seed?: Maxiterations;
  sender?: Order;
  sender_name?: Sendername;
  session_id?: Sendername;
  system_prompt?: Agentdescription;
  temperature?: Temperature;
  template?: Agentdescription;
  timeout?: Maxiterations;
  tools?: Memory;
  verbose?: Addcurrentdatetool;
  background_color?: Sendername;
  chat_icon?: Sendername;
  files?: Files;
  should_store_message?: Addcurrentdatetool;
  text_color?: Sendername;
  clean_data?: Addcurrentdatetool;
  data_template?: Sendername;
  tools_metadata?: Toolsmetadata;
}

interface Toolsmetadata {
  tool_mode: boolean;
  is_list: boolean;
  list_add_label: string;
  table_schema: Tableschema;
  trigger_text: string;
  trigger_icon: string;
  table_icon: string;
  table_options: Tableoptions;
  trace_as_metadata: boolean;
  required: boolean;
  placeholder: string;
  show: boolean;
  name: string;
  value: Value[];
  display_name: string;
  advanced: boolean;
  dynamic: boolean;
  info: string;
  real_time_refresh: boolean;
  title_case: boolean;
  type: string;
  _input_type: string;
}

interface Value {
  name: string;
  description: string;
  tags: string[];
}

interface Tableoptions {
  block_add: boolean;
  block_delete: boolean;
  block_edit: boolean;
  block_sort: boolean;
  block_filter: boolean;
  block_hide: boolean;
  block_select: boolean;
  hide_options: boolean;
  field_parsers: Fieldparsers;
  description: string;
}

interface Fieldparsers {
  name: string[];
  commands: string;
}

interface Tableschema {
  columns: Column[];
}

interface Column {
  name: string;
  display_name: string;
  sortable: boolean;
  filterable: boolean;
  formatter: string;
  type: string;
  description: string;
  default: string;
  disable_edit: boolean;
  edit_mode: string;
  hidden: boolean;
}

interface Files {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  fileTypes: string[];
  file_path: string;
  info: string;
  list: boolean;
  list_add_label: string;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Temperature {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  max_label: string;
  max_label_icon: string;
  min_label: string;
  min_label_icon: string;
  name: string;
  placeholder: string;
  range_spec: Rangespec;
  required: boolean;
  show: boolean;
  slider_buttons: boolean;
  slider_buttons_options: any[];
  slider_input: boolean;
  title_case: boolean;
  tool_mode: boolean;
  type: string;
  value: number;
}

interface Sendername {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  input_types: string[];
  list: boolean;
  list_add_label: string;
  load_from_db: boolean;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_input: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Order {
  _input_type: string;
  advanced: boolean;
  combobox: boolean;
  dialog_inputs: Dialoginputs;
  display_name: string;
  dynamic: boolean;
  info: string;
  name: string;
  options: string[];
  options_metadata: any[];
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Openaiapibase {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  list: boolean;
  list_add_label: string;
  load_from_db: boolean;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Modelname {
  _input_type: string;
  advanced: boolean;
  combobox: boolean;
  dialog_inputs: Dialoginputs;
  display_name: string;
  dynamic: boolean;
  info: string;
  name: string;
  options: string[];
  options_metadata: any[];
  placeholder: string;
  real_time_refresh: boolean;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Modelkwargs {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  list: boolean;
  list_add_label: string;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_input: boolean;
  type: string;
  value: Dialoginputs;
}

interface Memory {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  input_types: string[];
  list: boolean;
  list_add_label: string;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Maxtokens {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  list: boolean;
  list_add_label: string;
  name: string;
  placeholder: string;
  range_spec: Rangespec;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Rangespec {
  max: number;
  min: number;
  step: number;
  step_type: string;
}

interface Maxiterations {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  list: boolean;
  list_add_label: string;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: number;
}

interface Inputvalue {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  input_types: string[];
  list: boolean;
  list_add_label: string;
  load_from_db?: boolean;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode?: boolean;
  trace_as_input?: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
  copy_field?: boolean;
  multiline?: boolean;
}

interface Code {
  advanced: boolean;
  dynamic: boolean;
  fileTypes: any[];
  file_path: string;
  info: string;
  list: boolean;
  load_from_db: boolean;
  multiline: boolean;
  name: string;
  password: boolean;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  type: string;
  value: string;
}

interface Apikey {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  input_types: string[];
  load_from_db: boolean;
  name: string;
  password: boolean;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  type: string;
  value: string;
}

interface Agentllm {
  _input_type: string;
  advanced: boolean;
  combobox: boolean;
  dialog_inputs: Dialoginputs;
  display_name: string;
  dynamic: boolean;
  info: string;
  input_types: any[];
  name: string;
  options: string[];
  options_metadata: Optionsmetadatum[];
  placeholder: string;
  real_time_refresh: boolean;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Optionsmetadatum {
  icon: string;
}

interface Dialoginputs {}

interface Agentdescription {
  _input_type: string;
  advanced: boolean;
  copy_field: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  input_types: string[];
  list: boolean;
  list_add_label: string;
  load_from_db: boolean;
  multiline: boolean;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_input: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: string;
}

interface Addcurrentdatetool {
  _input_type: string;
  advanced: boolean;
  display_name: string;
  dynamic: boolean;
  info: string;
  list: boolean;
  list_add_label: string;
  name: string;
  placeholder: string;
  required: boolean;
  show: boolean;
  title_case: boolean;
  tool_mode: boolean;
  trace_as_metadata: boolean;
  type: string;
  value: boolean;
}

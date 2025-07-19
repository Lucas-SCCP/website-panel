export interface Element {
  id: number;
  element_type_id: number;
  component_id: number;
  component_parent: number | null;
  size: number;
  sort: number;
  content: string;
  properties: {
    title: string,
    name: string,
    text: string,
    placeholder: string,
    type?: string,
    validateType?: string,
    loadingMessage?: string,
    action?: string,
    successMessageId?: number,
    successActionId?: number,
    href?: string,
    message?: string,
    variant?: string,
    style: {
      color: string,
      fontSize: string,
      textAlign: string,
      fontWeight: string,
      display: string,
      height: string,
      alignItems: string,
      marginTop: string,
      marginLeft: string
    }
  };
}

export interface Component {
  id: number;
  name: string;
  page_id: number;
  component_type_id: number;
  size: number;
  sort: number;
  properties: JSON;
  enabled: boolean;
  elements: {
    line: number,
    content: Element[];
  };
}

export interface Page {
  id: number;
  name: string;
  title: string;
  website_id: number;
  path: string;
  menu: number;
  menu_order: number;
  enabled: boolean;
  components: Component[];
}

export interface Website {
  id: number;
  name: string;
  domain: string;
  pages: Page[];
}

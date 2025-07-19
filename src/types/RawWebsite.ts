export type RawWebsite = {
  id: number;
  name: string;
  domain: string;
  pages: Array<{
    id: number;
    name: string;
    title: string;
    website_id: number;
    path: string;
    menu: number;
    menu_order: number;
    enabled: boolean;
    components: Array<{
      id: number;
      name: string;
      page_id: number;
      component_type_id: number;
      size: string | number;
      sort: number;
      properties: string | object;
      elements: {
        line: number;
        content: {
          id: number;
          element_type_id: number;
          component_id: number;
          component_parent: number | null;
          size: string | number;
          sort: number;
          content?: string;
          properties: string | object;
        }
      };
    }>
  }>
};

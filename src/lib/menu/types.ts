// A header-menu tree, editable in the admin Menu Builder. One structure with
// bilingual labels per node and a shared URL; nests arbitrarily deep.
export interface MenuNode {
  id: string;
  labelEn: string;
  labelZh: string;
  /** path key without leading slash (e.g. "services/crew-manning", "" = home)
   *  or a full external URL (http…) when external is true */
  url: string;
  external?: boolean;
  children?: MenuNode[];
}

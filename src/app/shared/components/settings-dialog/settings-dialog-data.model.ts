import { PRODUCT_CATEGORIES } from '../../../utils/enums';

export interface SettingsDialogData {
  marketId: string;
  marketName: string;
  categories: PRODUCT_CATEGORIES[];
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isoCurrencySearch'
})
export class ISOCurrencySearchPipe implements PipeTransform {
  transform(items: any, filterText: string): any {
    if(filterText && filterText.length > 0) {
      if(items) {
        return items.filter((item: any) => {
          if(item.iso_currency_name && item.currency && item.country_name) {
            return ((item.iso_currency_name as string).toLowerCase().includes(filterText.toLowerCase()) || (item.currency as string).toLowerCase().includes(filterText.toLowerCase()) || (item.country_name as string).toLowerCase().includes(filterText.toLowerCase()));
          }
        })
      }
    } else {
      return items;
    }
  }
}

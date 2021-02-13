import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter3'
})
export class FilterPipe2 implements PipeTransform {
 transform(items: any, filter: any, defaultFilter: boolean): any {
    if(!items || !filter) {
      return items;
    }
      return items.filter(function(search){       
        return search.currency_type? search.currency_type.toLowerCase().indexOf(filter.toLowerCase())>-1 : search.data;      
      })
    }
  }
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter2'
})
export class FilterPipe implements PipeTransform {
  // transform(value:any,searchTerm:any):any{
  //   return value.filter(function(search){
  //     return search.currency.indexOf(searchTerm)>-1
  //   })
  // }
  transform(items: any, filter: any, defaultFilter: boolean): any {
    if(items) {
      return items.filter(function(search){       
        return search.currency? search.currency.toLowerCase().indexOf(filter.toLowerCase())>-1 : search.data;      
      })
    }
  }
}

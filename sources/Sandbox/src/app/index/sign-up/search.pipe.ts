import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

 transform(value:any,searchTerm:any):any{
    return value.filter(function(search){
      return search.country_name.toLowerCase().indexOf(searchTerm)>-1
    })
  }
}

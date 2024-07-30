import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeExtension'
})
export class RemoveExtensionPipe implements PipeTransform {
 
  transform(value: string): unknown {
    const withoutExtension=value.substring(0,value.lastIndexOf('.'))
    return withoutExtension;
  }

}

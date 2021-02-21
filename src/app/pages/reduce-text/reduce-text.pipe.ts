import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reduceText'
})
export class ReduceTextPipe implements PipeTransform {

  transform(value: string, ...args: number[]): string {
    return value.substring(0, args[0]);
  }

}

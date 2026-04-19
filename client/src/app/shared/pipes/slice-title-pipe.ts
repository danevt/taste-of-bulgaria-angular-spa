import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceTitle',
})
export class SliceTitle implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength) + '...';
  }
}

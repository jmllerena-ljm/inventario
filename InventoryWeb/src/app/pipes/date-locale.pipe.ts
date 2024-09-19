import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateLocale'
})
export class DateLocalePipe implements PipeTransform {

  transform(value: string, locale: string): any {
    // return new DatePipe(locale).transform(value, pattern);
    const DATE = new DatePipe(value.replace(/-/g, '\/').replace(/T.+/, ''));
    return DATE['locale'];
  }

}

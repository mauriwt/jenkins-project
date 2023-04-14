import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(obj): any {
    const keys = [];
    Object.entries(obj).forEach(
      ([key, value]) => keys.push(key)
    );
    return keys;
  }
}

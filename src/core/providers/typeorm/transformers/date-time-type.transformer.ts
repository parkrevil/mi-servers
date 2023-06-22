import { DateTime } from 'luxon';
import { FindOperator, ValueTransformer } from 'typeorm';

export class DateTimeTypeTransformer implements ValueTransformer {
  to(
    value: DateTime | FindOperator<DateTime> | null,
  ): string | FindOperator<DateTime> | null {
    if (value instanceof DateTime) {
      return value.toSQL({ includeOffset: false });
    }

    return value;
  }

  from(value: any): DateTime | null {
    return !!value ? DateTime.fromSQL(value) : null;
  }
}

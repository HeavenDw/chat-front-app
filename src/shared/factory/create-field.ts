import { createEvent, createStore, Event, sample } from 'effector';

interface CreateFieldParams<Value, Error> {
  defaultValue: Value;
  validate?: {
    fn: (value: Value) => Error | null;
    on: Event<void>;
  };
  resetOn?: Event<void>;
}

export function createField<Value, Error>(params: CreateFieldParams<Value, Error>) {
  const $value = createStore(params.defaultValue);
  const $error = createStore<Error | null>(null);
  const changed = createEvent<Value>();
  $value.on(changed, (_, value) => value);
  $error.reset(changed);

  if (params.validate) {
    sample({
      clock: params.validate.on,
      source: $value,
      fn: params.validate?.fn,
      target: $error,
    });
  }

  if (params.resetOn) {
    $value.reset(params.resetOn);
  }

  return { value: $value, error: $error, changed };
}

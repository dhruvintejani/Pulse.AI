import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PreloadableComponent<TComponent extends ComponentType<any>> = LazyExoticComponent<TComponent> & {
  preload: () => Promise<{ default: TComponent }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyWithPreload = <TComponent extends ComponentType<any>>(
  factory: () => Promise<{ default: TComponent }>
) => {
  const Component = lazy(factory) as PreloadableComponent<TComponent>;
  Component.preload = factory;
  return Component;
};

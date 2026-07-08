import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export type PreloadableComponent<TComponent extends ComponentType<any>> = LazyExoticComponent<TComponent> & {
  preload: () => Promise<{ default: TComponent }>;
};

export const lazyWithPreload = <TComponent extends ComponentType<any>>(
  factory: () => Promise<{ default: TComponent }>
) => {
  const Component = lazy(factory) as PreloadableComponent<TComponent>;
  Component.preload = factory;
  return Component;
};

import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export type PreloadableComponent<TComponent extends ComponentType<unknown>> = LazyExoticComponent<TComponent> & {
  preload: () => Promise<{ default: TComponent }>;
};

export const lazyWithPreload = <TProps extends object = Record<string, never>>(
  factory: () => Promise<{ default: ComponentType<TProps> }>
) => {
  type LoadedComponent = ComponentType<TProps>;
  const Component = lazy(factory) as PreloadableComponent<LoadedComponent>;
  Component.preload = factory;
  return Component;
};

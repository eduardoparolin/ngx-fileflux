import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider} from '@angular/core';
import {UploaderService} from './uploader/uploader.service';

export const NEW_CONFIG = new InjectionToken<string>('new fileflux config');

export function provideFileFlux(configValue?: string): Provider[] {
  return [
    {
      provide: NEW_CONFIG,
      useValue: configValue,
    },
    UploaderService,
  ];
}

export function provideEnvironmentFileFlux(
  configValue?: string
): EnvironmentProviders {
  return makeEnvironmentProviders(provideFileFlux(configValue));
}

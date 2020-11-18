import { Component } from '@angular/core';
import { ColorSchemeService } from 'src/app/core/services/color-scheme.service';

@Component({
  selector: 'app-color-scheme-setting',
  templateUrl: './color-scheme-setting.component.html',
  styleUrls: ['./color-scheme-setting.component.scss'],
})
export class ColorSchemeSettingComponent {
  public themes = [
    {
      name: 'dark',
      label: 'Sombre',
      icon: 'brightness_3',
    },
    {
      name: 'light',
      label: 'Clair',
      icon: 'wb_sunny',
    },
  ];

  constructor(public colorSchemeService: ColorSchemeService) {}

  setTheme(theme: string) {
    this.colorSchemeService.update(theme);
  }
}

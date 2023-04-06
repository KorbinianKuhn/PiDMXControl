import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdjSaberSpotModule } from '../devices/adj-saber-spot/adj-saber-spot.module';
import { BeamerModule } from '../devices/beamer/beamer.module';
import { EuroliteLedPixBarModule } from '../devices/eurolite-led-pix-bar/eurolite-led-pix-bar.module';
import { FunGenerationLedDiamondDomeModule } from '../devices/fun-generation-led-diamond-dome/fun-generation-led-diamond-dome.module';
import { VarytecGigabarHexModule } from '../devices/varytec-gigabar-hex/varytec-gigabar-hex.module';
import { VarytecHeroWashModule } from '../devices/varytec-hero-wash/varytec-hero-wash.module';
import { ToggleButtonModule } from '../toggle-button/toggle-button.module';
import { VisualizationComponent } from './visualization.component';

@NgModule({
  declarations: [VisualizationComponent],
  imports: [
    CommonModule,
    VarytecGigabarHexModule,
    EuroliteLedPixBarModule,
    VarytecHeroWashModule,
    FunGenerationLedDiamondDomeModule,
    AdjSaberSpotModule,
    ToggleButtonModule,
    BeamerModule,
  ],
  exports: [VisualizationComponent],
})
export class VisualizationModule {}

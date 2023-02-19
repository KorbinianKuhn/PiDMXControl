import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BpmModule } from '../../components/bpm/bpm.module';
import { AdjSaberSpotModule } from '../../components/devices/adj-saber-spot/adj-saber-spot.module';
import { EuroliteLedPixBarModule } from '../../components/devices/eurolite-led-pix-bar/eurolite-led-pix-bar.module';
import { FunGenerationLedDiamondDomeModule } from '../../components/devices/fun-generation-led-diamond-dome/fun-generation-led-diamond-dome.module';
import { VarytecGigabarHexModule } from '../../components/devices/varytec-gigabar-hex/varytec-gigabar-hex.module';
import { VarytecHeroWashModule } from '../../components/devices/varytec-hero-wash/varytec-hero-wash.module';

import { PadButtonModule } from '../../components/pad-button/pad-button.module';
import { ToggleButtonModule } from '../../components/toggle-button/toggle-button.module';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';

@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    BoardRoutingModule,
    PadButtonModule,
    BpmModule,
    VarytecGigabarHexModule,
    EuroliteLedPixBarModule,
    VarytecHeroWashModule,
    FunGenerationLedDiamondDomeModule,
    AdjSaberSpotModule,
    ToggleButtonModule,
  ],
})
export class BoardModule {}
